/**
 * Test import * as namespace with collision resolution
 */
import * as Utils from "./namespace-utils";
import { InternalService } from "./namespace-internal";

// Use namespace types
export class NamespaceService {
  status: Utils.Status;  // Should use Utils.Status
  config: Utils.Config;  // Should use Utils.Config

  constructor() {
    this.status = Utils.createStatus();
    this.config = Utils.createConfig();
  }
}

// Re-export internal service
export { InternalService };

// Export namespace
export { Utils };

// Export own types that collide with both internal and namespace
export type Status = "success" | "failure";
export type Config = {
  apiKey: string;
  endpoint: string;
};
