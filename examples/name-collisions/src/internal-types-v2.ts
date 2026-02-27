/**
 * Internal types - using type aliases instead of interfaces/classes
 */
type Status = "active" | "inactive";
type Config = {
  enabled: boolean;
};
type Logger = {
  log: (message: string) => void;
};
type CONSTANT = 42;

// Export an entity that uses these internal types
export class Service {
  status: Status;
  config: Config;
  logger: Logger;
  value: CONSTANT;

  constructor() {
    this.status = "active";
    this.config = { enabled: true };
    this.logger = {
      log: (msg) => console.log(msg)
    };
    this.value = 42;
  }
}
