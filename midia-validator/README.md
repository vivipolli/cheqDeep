# Media Validator API

API for validating and extracting metadata from images and videos.

## Requirements

- Python 3.11+
- FFmpeg (for video processing)

## Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
.\venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
uvicorn server:app --reload
```


## API Endpoints

- `POST /analyze`: Upload and analyze media files
  - Accepts: image/* or video/* files
  - Returns: Metadata and authenticity analysis 