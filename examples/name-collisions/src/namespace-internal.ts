/**
 * Internal module with types that will collide
 */
type Status = "active" | "inactive";
type Config = { enabled: boolean };

export class InternalService {
  status: Status;  // Should use this file's Status
  config: Config;  // Should use this file's Config

  constructor() {
    this.status = "active";
    this.config = { enabled: true };
  }
}
