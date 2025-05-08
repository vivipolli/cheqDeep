# DeepCheq - Media Authenticity Verification

A decentralized solution for verifying the authenticity of digital media using Cheqd's blockchain technology.

## Overview

DeepCheq provides a secure and immutable way to certify and verify digital media authenticity. Using Decentralized Identifiers (DIDs) and Verifiable Credentials, it creates a permanent record of media ownership and authenticity.

## How It Works

1. **Media Capture**
   - User captures media (image/video/audio)
   - System generates a unique hash
   - Collects rich metadata from capture device

2. **Digital Identity Creation**
   - Generates cryptographic key pair
   - Creates unique DID for the creator
   - Establishes verifiable identity

3. **Authenticity Certificate**
   - Creates a blockchain-based certificate
   - Links media hash to creator's DID
   - Includes detailed capture metadata

4. **Verification Process**
   - Anyone can verify media authenticity
   - Compares current hash with certificate
   - Validates digital signatures

  
## Current Limitations

### Media Source Verification
Currently, DeepCheq only accepts media files that are directly uploaded from their original capture devices. This means:

- ✅ Photos taken directly from smartphones
- ✅ Videos recorded directly from mobile devices
- ❌ Edited images (e.g., from Photoshop)
- ❌ Professional camera exports
- ❌ Screenshots
- ❌ Downloaded media

This limitation exists because we need to verify the authenticity of the media source. In future versions, we plan to implement:

- Support for professional camera metadata
- Verification of edited media with proper attribution
- Integration with professional editing software
- Support for batch uploads from professional equipment

### Why This Limitation?

The current system relies on device metadata to verify the authenticity of media. This is a security measure to ensure that only original content can be certified. We understand this may be restrictive for some use cases, but it's necessary to maintain the integrity of our verification system.

## Features

- **Hash-Based Verification**: Focus on authenticity without storage
- **Rich Metadata**: Detailed capture device information
- **Decentralized Verification**: No central authority needed
- **Traceability**: Complete history of media authenticity
- **Interoperability**: W3C standards (DIDs, Verifiable Credentials)

## Future Features

- **Premium Storage**: Optional media storage feature (coming soon)
- **Advanced Analytics**: Detailed media usage statistics
- **Batch Processing**: Multiple media verification
- **API Access**: Developer tools for integration

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_CHEQD_API_KEY=your_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Integration

The system uses Cheqd's Studio API for:
- DID creation and management
- Resource creation and verification
- Key pair generation and management

## Learn More

- [Cheqd Documentation](https://docs.cheqd.io)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)
- [Decentralized Identifiers](https://www.w3.org/TR/did-core/)

## License

MIT License
