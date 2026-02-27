/**
 * Internal module for namespace export test
 */
type Status = "active" | "inactive";

export class Service {
  status: Status;  // Uses this file's internal Status

  constructor() {
    this.status = "active";
  }
}
