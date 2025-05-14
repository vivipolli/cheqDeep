# CheqDeep - AI-Generated Content Verification 🔍

A decentralized solution for verifying media authenticity using Cheqd's blockchain technology and DID Linked Resources.

## The Challenge 🎯

In today's digital landscape, AI-generated content is becoming increasingly indistinguishable from human-created media. This poses significant challenges for:
- Content creators proving their work is authentic
- Journalists verifying source material
- Legal professionals validating evidence
- Digital artists protecting their creations

## Our Solution 💡

CheqDeep leverages Cheqd's blockchain technology to create an immutable chain of custody for digital media. By combining DID Linked Resources with rich metadata capture, we provide a robust verification system that proves media authenticity.

### Key Technologies ⚡

- **Cheqd Blockchain**: For immutable storage and verification
- **DID Linked Resources**: To store and link media metadata
- **IPFS Integration**: For decentralized media storage
- **W3C Standards**: Following DID and Verifiable Credentials specifications

## Current Limitations ⚠️

- Only accepts real-world photos and videos (no artistic content)
- Requires direct upload from capture device
- Limited to image and video formats
- No support for professional camera exports
- No batch processing capabilities

## How It Works 🔄

1. **Media Capture & Analysis**
   - User uploads media (image/video)
   - System captures device metadata
   - Analyzes technical markers for AI generation

2. **DID & Resource Creation**
   - Generates unique DID for the creator
   - Creates DID Linked Resource with metadata
   - Stores media hash and verification data

3. **Blockchain Certification**
   - Links media to creator's DID
   - Creates immutable timestamp
   - Establishes verifiable chain of custody

4. **Verification Process**
   - Anyone can verify media authenticity
   - Checks DID Linked Resource data
   - Validates blockchain signatures

## Technical Implementation 🛠️

### DID Linked Resources
- Stores media metadata in Cheqd's blockchain
- Links content to creator's DID
- Maintains immutable verification history

### IPFS Integration
- Decentralized storage for media files
- Content-addressed storage
- Permanent accessibility

### Verification System
- Real-time DID resolution
- Resource metadata validation
- Blockchain signature verification

## Future Enhancements 🚀

### Priority Features
- **User Authentication**: Login system with certificate history
- **Payment Integration**: Pay-per-verification system

### Technical Improvements
- Support for professional camera metadata
- AI detection algorithms
- Batch processing capabilities

## Getting Started 📥

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_CHEQD_API_KEY=your_api_key
NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret
NEXT_PUBLIC_MIDIA_VALIDATOR_URL=midia_validator_api
```

4. Run the development server:
```bash
npm run dev
```

## API Integration 🔌

The system uses:
- Cheqd's Studio API for DID and Resource management
- Pinata API for IPFS storage
- W3C standards for verification

## Learn More 📚

- [Cheqd Documentation](https://docs.cheqd.io)
- [DID Linked Resources](https://docs.cheqd.io/identity/architecture/adr-list/adr-002-did-linked-resources)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)

## License

MIT License
