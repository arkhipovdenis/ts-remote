/**
 * Advanced internal types with complex TypeScript constructs
 */

// Internal types that will collide
type Status = "active" | "inactive";
type Config = { enabled: boolean };
type Logger = { log: (msg: string) => void };

// Conditional types using internal types
type StatusResult<T> = T extends Status ? "valid" : "invalid";

// Mapped types using internal types
type ReadonlyConfig = {
  readonly [K in keyof Config]: Config[K];
};

// Utility types
type PartialLogger = Partial<Logger>;
type RequiredConfig = Required<Config>;

// Template literal types
type StatusMessage = `status-${Status}`;

// Indexed access types
type ConfigEnabled = Config["enabled"];

// Intersection and union with internal types
type ConfigWithStatus = Config & { status: Status };
type LoggerOrConfig = Logger | Config;

// Generic type with constraints
type Container<T extends Config> = {
  data: T;
  status: Status;
};

// Recursive type
type NestedStatus = {
  current: Status;
  previous?: NestedStatus;
};

// Function types with internal types
type StatusChecker = (status: Status) => boolean;
type ConfigFactory = () => Config;
type LoggerFactory<T extends Logger = Logger> = (name: string) => T;

// Infer types
type ExtractStatus<T> = T extends { status: infer S } ? S : never;
type StatusFromChecker = ExtractStatus<{ status: Status }>;

// Tuple types
type StatusTuple = [Status, Config, Logger];
type NamedStatusTuple = [status: Status, config: Config];

// Rest types
type StatusArray = Status[];
type ConfigRecord = Record<string, Config>;

// Export a complex service that uses all internal types
export class AdvancedService {
  status: Status;
  config: Config;
  logger: Logger;

  statusResult: StatusResult<Status>;
  readonlyConfig: ReadonlyConfig;
  partialLogger: PartialLogger;
  statusMessage: StatusMessage;
  configEnabled: ConfigEnabled;
  configWithStatus: ConfigWithStatus;
  loggerOrConfig: LoggerOrConfig;
  container: Container<Config>;
  nestedStatus: NestedStatus;

  checker: StatusChecker;
  configFactory: ConfigFactory;
  loggerFactory: LoggerFactory;

  statusFromChecker: StatusFromChecker;
  statusTuple: StatusTuple;
  namedTuple: NamedStatusTuple;
  statusArray: StatusArray;
  configRecord: ConfigRecord;

  constructor() {
    this.status = "active";
    this.config = { enabled: true };
    this.logger = { log: () => {} };
    this.statusResult = "valid";
    this.readonlyConfig = { enabled: true };
    this.partialLogger = {};
    this.statusMessage = "status-active";
    this.configEnabled = true;
    this.configWithStatus = { enabled: true, status: "active" };
    this.loggerOrConfig = { enabled: true };
    this.container = { data: { enabled: true }, status: "active" };
    this.nestedStatus = { current: "active" };
    this.checker = () => true;
    this.configFactory = () => ({ enabled: true });
    this.loggerFactory = () => ({ log: () => {} });
    this.statusFromChecker = "active";
    this.statusTuple = ["active", { enabled: true }, { log: () => {} }];
    this.namedTuple = ["active", { enabled: true }];
    this.statusArray = ["active"];
    this.configRecord = { key: { enabled: true } };
  }

  // Methods using internal types
  getStatus(): Status {
    return this.status;
  }

  updateConfig(config: Config): void {
    this.config = config;
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }

  // Generic method with internal type constraint
  processContainer<T extends Config>(container: Container<T>): Status {
    return container.status;
  }

  // Method with mapped type parameter
  updatePartial(partial: Partial<Config>): void {
    this.config = { ...this.config, ...partial };
  }

  // Method with conditional type
  checkStatus<T>(value: T): StatusResult<T> {
    return (value === "active" || value === "inactive" ? "valid" : "invalid") as StatusResult<T>;
  }
}

// Export another class with different internal type usage
export class TypedContainer<T extends Status = Status> {
  value: T;
  config: Config;

  constructor(value: T) {
    this.value = value;
    this.config = { enabled: true };
  }

  getValue(): T {
    return this.value;
  }

  getConfig(): Config {
    return this.config;
  }
}

// Export function with complex return type
export function createService(): {
  service: AdvancedService;
  status: Status;
  config: ReadonlyConfig;
} {
  const service = new AdvancedService();
  return {
    service,
    status: service.status,
    config: service.readonlyConfig,
  };
}
