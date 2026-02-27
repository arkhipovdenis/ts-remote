/**
 * Advanced collision test with exported types that conflict with internal types
 */
import { AdvancedService, TypedContainer, createService } from "./advanced-internal";

// Export types with SAME names as internal types from advanced-internal.ts
// but with DIFFERENT structures

export type Status = "pending" | "completed" | "failed" | "cancelled";

export type Config = {
  name: string;
  version: number;
  settings: {
    debug: boolean;
  };
};

export type Logger = {
  level: "info" | "warn" | "error";
  write: (message: string) => void;
  flush: () => void;
};

// Export mapped types based on exported types
export type ReadonlyStatus = Readonly<Status>;
export type PartialConfig = Partial<Config>;
export type RequiredLogger = Required<Logger>;

// Export conditional types
export type IsStatus<T> = T extends Status ? true : false;
export type ExtractConfigValue<K extends keyof Config> = Config[K];

// Export template literal types
export type LogLevel = `log-${Logger["level"]}`;
export type StatusEvent = `status:${Status}`;

// Export utility types
export type ConfigKeys = keyof Config;
export type LoggerValues = Logger[keyof Logger];

// Export complex intersection types
export type ServiceConfig = Config & {
  status: Status;
  logger: Logger;
};

// Export union types
export type AnyConfig = Config | { legacy: true };
export type StatusOrLogger = Status | Logger;

// Export generic types
export type Response<T = Status> = {
  data: T;
  config: Config;
  timestamp: number;
};

export type AsyncResult<T extends Status = Status> = Promise<{
  status: T;
  logger: Logger;
}>;

// Export function types using exported types
export type StatusValidator = (status: Status) => boolean;
export type ConfigTransformer = (config: Config) => Config;
export type LoggerProvider = () => Logger;

// Export indexed access and mapped types
export type ConfigMap = {
  [K in keyof Config]: Config[K] extends object ? Partial<Config[K]> : Config[K];
};

export type StatusRecord = Record<Status, Config>;

// Export conditional mapped types
export type OptionalConfig<T extends keyof Config> = {
  [K in T]?: Config[K];
};

// Export template literal types with unions
export type HttpStatus = `http-${Status}-${number}`;

// Export infer types
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type ExtractData<T> = T extends { data: infer D } ? D : never;

// Export recursive types
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type DeepConfig = DeepPartial<Config>;

// Re-export the service classes that use internal types
export { AdvancedService, TypedContainer, createService };

// Export a new class that uses the exported types
export class PublicService {
  status: Status;
  config: Config;
  logger: Logger;

  constructor(status: Status, config: Config, logger: Logger) {
    this.status = status;
    this.config = config;
    this.logger = logger;
  }

  getStatus(): Status {
    return this.status;
  }

  updateConfig(config: Config): void {
    this.config = config;
  }

  setLogger(logger: Logger): void {
    this.logger = logger;
  }
}

// Export a factory function
export function createPublicService(): PublicService {
  return new PublicService(
    "pending",
    { name: "test", version: 1, settings: { debug: false } },
    { level: "info", write: () => {}, flush: () => {} }
  );
}

// Export a type that combines both internal and exported concepts
export type CombinedService = {
  advanced: AdvancedService;
  public: PublicService;
  status: Status;  // This refers to exported Status
  config: Config;  // This refers to exported Config
};

// Export generic utility type
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Export discriminated union
export type Result =
  | { status: Extract<Status, "completed">; data: Config }
  | { status: Extract<Status, "failed">; error: string }
  | { status: Extract<Status, "pending"> };

// Export type with variance
export type Getter<out T> = () => T;
export type Setter<in T> = (value: T) => void;
export type GetSet<in out T> = {
  get: () => T;
  set: (value: T) => void;
};

export type StatusGetter = Getter<Status>;
export type ConfigSetter = Setter<Config>;
