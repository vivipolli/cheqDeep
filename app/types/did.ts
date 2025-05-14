interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyMultibase: string;
}

interface Service {
  id: string;
  type: string;
  serviceEndpoint: string;
}

interface DIDDocument {
  context: string[];
  id: string;
  controller: string;
  verificationMethod: VerificationMethod[];
  service: Service[];
  [key: string]: unknown;
}

export type { DIDDocument, VerificationMethod, Service }; 