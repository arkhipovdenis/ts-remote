/**
 * Extreme collision test - exported types with same names but different structures
 */
import { ExtremeService, Container, createExtreme } from "./extreme-internal";

// Export types with SAME names but COMPLETELY different structures
export type Status =
  | { type: "success"; code: 200 }
  | { type: "error"; code: 400 | 500 };

export type Config = {
  apiKey: string;
  endpoint: URL;
  timeout: number;
  retries: number;
};

export type Meta = {
  version: string;
  timestamp: Date;
  author: string;
};

// Export complex mapped types using exported types
export type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

// Export template literal types
export type StatusType = Status["type"];
export type ConfigKeys = keyof Config;
export type MetaKeys = keyof Meta;

// Export utility types
export type ReadonlyStatus = Readonly<Status>;
export type PartialConfig = Partial<Config>;
export type RequiredMeta = Required<Meta>;

// Export mapped types with transformations
export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export type AsyncFields<T> = {
  [K in keyof T]: Promise<T[K]>;
};

// Export conditional types
export type IsSuccess<T> = T extends { type: "success" } ? true : false;
export type ExtractCode<T> = T extends { code: infer C } ? C : never;

// Export discriminated unions
export type Result<T> =
  | { status: Extract<Status, { type: "success" }>; data: T }
  | { status: Extract<Status, { type: "error" }>; error: string };

// Export generic utility types
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
export type Unwrap<T> = T extends (infer U)[] ? U : T;

// Export mapped types with key remapping
export type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

export type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

export type ConfigGetters = Getters<Config>;
export type ConfigSetters = Setters<Config>;

// Export template literal unions
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export type ApiRoute = `/${string}`;
export type Endpoint = `${HttpMethod} ${ApiRoute}`;

// Export complex intersections
export type ApiConfig = Config & {
  headers: Record<string, string>;
  method: HttpMethod;
};

export type ApiMeta = Meta & {
  requestId: string;
  duration: number;
};

// Export recursive types
export type Tree<T> = {
  value: T;
  children?: Tree<T>[];
};

export type StatusTree = Tree<Status>;
export type ConfigTree = Tree<Config>;

// Export variadic tuples
export type Prepend<T extends readonly unknown[], U> = [U, ...T];
export type Append<T extends readonly unknown[], U> = [...T, U];

// Export higher-order types
export type Transformer<T, U> = {
  [K in keyof T]: U;
};

export type Validator<T> = {
  [K in keyof T]: (value: T[K]) => boolean;
};

// Export conditional mapped types
export type FilterByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// Export template literal types with complex patterns
export type EventName<T> = {
  [K in keyof T]: `on${Capitalize<string & K>}Change`;
}[keyof T];

export type ConfigEventName = EventName<Config>;

// Export infer types with nesting
export type UnwrapPromise<T> = T extends Promise<infer U>
  ? UnwrapPromise<U>
  : T;

export type ExtractReturn<T> = T extends (...args: any[]) => infer R ? R : never;

// Export variance annotations (TypeScript 4.7+)
export type Provider<out T> = () => T;
export type Consumer<in T> = (value: T) => void;
export type Mutable<in out T> = {
  get: () => T;
  set: (value: T) => void;
};

// Re-export internal service classes
export { ExtremeService, Container, createExtreme };

// Export new class using exported types
export class ApiService {
  status: Status;
  config: Config;
  meta: Meta;

  constructor(status: Status, config: Config, meta: Meta) {
    this.status = status;
    this.config = config;
    this.meta = meta;
  }

  getStatus(): Status {
    return this.status;
  }

  updateConfig(config: Partial<Config>): void {
    this.config = { ...this.config, ...config };
  }

  setMeta(meta: Meta): void {
    this.meta = meta;
  }
}

// Export factory functions
export function createSuccess<T>(data: T): Result<T> {
  return {
    status: { type: "success", code: 200 },
    data,
  };
}

export function createError<T>(error: string): Result<T> {
  return {
    status: { type: "error", code: 500 },
    error,
  };
}

// Export type combining internal and exported concepts
export type CombinedService = {
  extreme: ExtremeService;
  api: ApiService;
  status: Status;  // Exported Status
  config: Config;  // Exported Config
  meta: Meta;      // Exported Meta
};

// Export complex generic type
export type AsyncService<T extends Config = Config> = {
  config: T;
  getConfig: () => Promise<T>;
  updateConfig: (config: Partial<T>) => Promise<void>;
  validate: (config: T) => Promise<boolean>;
};

// Export discriminated union with generics
export type Operation<T = unknown> =
  | { kind: "read"; path: string }
  | { kind: "write"; path: string; data: T }
  | { kind: "delete"; path: string };

export type ConfigOperation = Operation<Config>;

// Export branded types
export type Brand<T, B> = T & { __brand: B };
export type StatusId = Brand<string, "StatusId">;
export type ConfigId = Brand<number, "ConfigId">;
