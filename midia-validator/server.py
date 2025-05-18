import os
import mimetypes
import json
import subprocess
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS
from typing import Dict, Any, Optional
import tempfile
import piexif
from hachoir.parser import createParser
from hachoir.metadata import extractMetadata
from pillow_heif import register_heif_opener

# Register HEIF opener
register_heif_opener()

# Add HEVC mime type
mimetypes.add_type('video/hevc', '.hevc')

app = FastAPI(title="Media Validator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure maximum file size (100MB)
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB in bytes

def get_image_metadata(image_path: str, include_gps: bool = False) -> Dict[str, Any]:
    image = Image.open(image_path)
    exif_data = image._getexif()
    metadata = {}

    if exif_data:
        gps_info = {}
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "GPSInfo" and include_gps:
                for key in value:
                    name = GPSTAGS.get(key, key)
                    gps_info[name] = value[key]
                metadata["GPS"] = convert_gps(gps_info)
            else:
                metadata[tag] = value
    return metadata

def convert_gps(gps_data: Dict[str, Any]) -> Dict[str, float]:
    def to_decimal(dms, ref):
        degrees = dms[0][0] / dms[0][1]
        minutes = dms[1][0] / dms[1][1]
        seconds = dms[2][0] / dms[2][1]
        decimal = degrees + (minutes / 60.0) + (seconds / 3600.0)
        if ref in ['S', 'W']:
            decimal = -decimal
        return decimal

    lat = lon = None
    if "GPSLatitude" in gps_data and "GPSLatitudeRef" in gps_data:
        lat = to_decimal(gps_data["GPSLatitude"], gps_data["GPSLatitudeRef"])
    if "GPSLongitude" in gps_data and "GPSLongitudeRef" in gps_data:
        lon = to_decimal(gps_data["GPSLongitude"], gps_data["GPSLongitudeRef"])
    return {"Latitude": lat, "Longitude": lon}

def get_video_metadata(video_path: str) -> Dict[str, Any]:
    cmd = [
        'ffprobe', '-v', 'quiet',
        '-print_format', 'json',
        '-show_format', '-show_streams',
        video_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return json.loads(result.stdout)

def extract_metadata(file_path: str, include_gps: bool = False) -> Dict[str, Any]:
    mime_type, _ = mimetypes.guess_type(file_path)

    if mime_type:
        if mime_type.startswith('image'):
            return get_image_metadata(file_path, include_gps=include_gps)
        elif mime_type.startswith('video'):
            return get_video_metadata(file_path)
        else:
            raise HTTPException(status_code=400, detail="Tipo de arquivo não suportado")
    else:
        raise HTTPException(status_code=400, detail="Não foi possível determinar o tipo do arquivo")

def extract_video_metadata(video_path: str) -> dict:
    try:
        print(f"[DEBUG] Starting video metadata extraction for: {video_path}")
        metadata = {
            "fileSize": os.path.getsize(video_path),
            "fileType": mimetypes.guess_type(video_path)[0] or "video/mp4",
            "FileName": os.path.basename(video_path)
        }
        print(f"[DEBUG] Basic metadata: {metadata}")
        
        parser = createParser(video_path)
        if parser:
            print("[DEBUG] Parser created successfully")
            with parser:
                meta = extractMetadata(parser)
                if meta:
                    print(f"[DEBUG] Raw metadata from hachoir: {meta}")
                    metadata.update({
                        "duration": str(meta.get('duration', 'unknown')),
                        "bitrate": str(meta.get('bit_rate', 'unknown')),
                        "width": str(meta.get('width', 'unknown')),
                        "height": str(meta.get('height', 'unknown')),
                        "codec": str(meta.get('codec', 'unknown')),
                        "fps": str(meta.get('frame_rate', 'unknown')),
                        "creation_date": str(meta.get('creation_date', 'unknown')),
                        "last_modification": str(meta.get('last_modification', 'unknown')),
                        "mime_type": str(meta.get('mime_type', 'unknown')),
                        "producer": str(meta.get('producer', 'unknown')),
                        "copyright": str(meta.get('copyright', 'unknown')),
                        "comment": str(meta.get('comment', 'unknown')),
                        "operating_system": str(meta.get('operating_system', 'unknown')),
                        "os_version": str(meta.get('os_version', 'unknown')),
                        "os_release": str(meta.get('os_release', 'unknown')),
                        "os_architecture": str(meta.get('os_architecture', 'unknown'))
                    })
                    if meta.get('width') and meta.get('height'):
                        metadata["resolution"] = f"{meta.get('width')}x{meta.get('height')}"
                    print(f"[DEBUG] Final processed metadata: {metadata}")
                else:
                    print("[DEBUG] No metadata found in parser")
        else:
            print("[DEBUG] Failed to create parser")
                
        return metadata
        
    except Exception as e:
        print(f"[ERROR] Error extracting video metadata: {str(e)}")
        print(f"[ERROR] Error type: {type(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error extracting video metadata: {str(e)}")

def extract_image_metadata(image_path: str) -> dict:
    try:
        with Image.open(image_path) as img:
            metadata = {
                "fileSize": os.path.getsize(image_path),
                "fileType": img.format,
                "resolution": f"{img.width}x{img.height}",
            }

            # Try to get EXIF data
            try:
                exif_dict = piexif.load(image_path)
                if exif_dict:
                    if "0th" in exif_dict:
                        if piexif.ImageIFD.Make in exif_dict["0th"]:
                            metadata["Make"] = exif_dict["0th"][piexif.ImageIFD.Make].decode('utf-8', errors='ignore')
                        if piexif.ImageIFD.Model in exif_dict["0th"]:
                            metadata["Model"] = exif_dict["0th"][piexif.ImageIFD.Model].decode('utf-8', errors='ignore')
                        if piexif.ImageIFD.Software in exif_dict["0th"]:
                            metadata["software"] = exif_dict["0th"][piexif.ImageIFD.Software].decode('utf-8', errors='ignore')
                        if piexif.ImageIFD.DateTime in exif_dict["0th"]:
                            metadata["DateTimeOriginal"] = exif_dict["0th"][piexif.ImageIFD.DateTime].decode('utf-8', errors='ignore')
                        if piexif.ImageIFD.Artist in exif_dict["0th"]:
                            metadata["Artist"] = exif_dict["0th"][piexif.ImageIFD.Artist].decode('utf-8', errors='ignore')
                        if piexif.ImageIFD.Copyright in exif_dict["0th"]:
                            metadata["Copyright"] = exif_dict["0th"][piexif.ImageIFD.Copyright].decode('utf-8', errors='ignore')

                    # Extract GPS info if available
                    if "GPS" in exif_dict:
                        gps_info = {}
                        if piexif.GPSIFD.GPSLatitude in exif_dict["GPS"] and piexif.GPSIFD.GPSLatitudeRef in exif_dict["GPS"]:
                            lat = exif_dict["GPS"][piexif.GPSIFD.GPSLatitude]
                            lat_ref = exif_dict["GPS"][piexif.GPSIFD.GPSLatitudeRef].decode('utf-8')
                            metadata["GPSLatitude"] = float(lat[0]) + float(lat[1])/60 + float(lat[2])/3600
                            if lat_ref == 'S':
                                metadata["GPSLatitude"] = -metadata["GPSLatitude"]

                        if piexif.GPSIFD.GPSLongitude in exif_dict["GPS"] and piexif.GPSIFD.GPSLongitudeRef in exif_dict["GPS"]:
                            lon = exif_dict["GPS"][piexif.GPSIFD.GPSLongitude]
                            lon_ref = exif_dict["GPS"][piexif.GPSIFD.GPSLongitudeRef].decode('utf-8')
                            metadata["GPSLongitude"] = float(lon[0]) + float(lon[1])/60 + float(lon[2])/3600
                            if lon_ref == 'W':
                                metadata["GPSLongitude"] = -metadata["GPSLongitude"]

                        if piexif.GPSIFD.GPSAltitude in exif_dict["GPS"]:
                            alt = exif_dict["GPS"][piexif.GPSIFD.GPSAltitude]
                            metadata["GPSAltitude"] = float(alt[0]) / float(alt[1])

                    # Extract additional EXIF data
                    if "Exif" in exif_dict:
                        if piexif.ExifIFD.ExposureTime in exif_dict["Exif"]:
                            exp = exif_dict["Exif"][piexif.ExifIFD.ExposureTime]
                            metadata["ExposureTime"] = f"{exp[0]}/{exp[1]}"
                        if piexif.ExifIFD.FNumber in exif_dict["Exif"]:
                            fnum = exif_dict["Exif"][piexif.ExifIFD.FNumber]
                            metadata["FNumber"] = f"{fnum[0]}/{fnum[1]}"
                        if piexif.ExifIFD.ISOSpeedRatings in exif_dict["Exif"]:
                            metadata["ISO"] = exif_dict["Exif"][piexif.ExifIFD.ISOSpeedRatings]
                        if piexif.ExifIFD.FocalLength in exif_dict["Exif"]:
                            focal = exif_dict["Exif"][piexif.ExifIFD.FocalLength]
                            metadata["FocalLength"] = f"{focal[0]}/{focal[1]}"

            except Exception as exif_error:
                print(f"Error extracting EXIF data: {str(exif_error)}")
                metadata["warnings"] = ["Could not extract EXIF data"]

            return metadata
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

@app.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    try:
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {MAX_FILE_SIZE/1024/1024}MB"
            )

        # Create a temporary file with proper extension
        file_extension = os.path.splitext(file.filename)[1] if file.filename else '.jpg'
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            temp_file.write(content)
            temp_file.flush()
            temp_path = temp_file.name

        try:
            # Process the file based on its type
            if file.content_type.startswith('image/'):
                metadata = extract_image_metadata(temp_path)
                is_authentic = bool(metadata.get('Make') and metadata.get('Model'))
                confidence = 0.95 if is_authentic else 0.0
            elif file.content_type.startswith('video/'):
                metadata = extract_video_metadata(temp_path)
                is_authentic = bool(metadata.get('resolution') and metadata.get('duration'))
                confidence = 0.95 if is_authentic else 0.0
            else:
                raise HTTPException(status_code=400, detail="Unsupported file type")
                
            return {
                "isAuthentic": is_authentic,
                "confidence": confidence,
                "metadata": metadata,
                "warnings": metadata.get("warnings", [])
            }
                
        finally:
            # Clean up the temporary file
            try:
                os.unlink(temp_path)
            except Exception as e:
                print(f"Error deleting temporary file: {str(e)}")
                
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
