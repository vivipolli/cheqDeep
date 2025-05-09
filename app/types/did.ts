export interface DIDDocument {
  did: string;
  keys: {
    kid: string;
    kms: string;
    type: string;
    publicKeyHex: string;
    meta: {
      algorithms: string[];
    };
    controller: string;
  }[];
  services: any[];
  controllerKeys: {
    kid: string;
    kms: string;
    type: string;
    publicKeyHex: string;
    meta: {
      algorithms: string[];
    };
    controller: string;
  }[];
} 