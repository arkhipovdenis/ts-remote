/**
 * Internal types that will be used but not exported from the module
 */
type Status = "active" | "inactive";
interface Config {
  enabled: boolean;
}
class Logger {
  log(message: string) {}
}
const CONSTANT = 42;

// Export an entity that uses these internal types
export class Service {
  status: Status;
  config: Config;
  logger: Logger;
  value: typeof CONSTANT;

  constructor() {
    this.status = "active";
    this.config = { enabled: true };
    this.logger = new Logger();
    this.value = CONSTANT;
  }
}
