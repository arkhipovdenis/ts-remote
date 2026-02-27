/**
 * Extreme edge cases for collision resolution
 */

// Internal types
type Status = "on" | "off";
type Config = { value: number };
type Meta = { id: string };

// Nested mapped types with multiple levels
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object
    ? DeepPartial<T[K]>
    : T[K];
};

type NestedConfig = {
  outer: Config;
  inner: {
    config: Config;
    status: Status;
  };
};

// Mapped type with remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type ConfigGetters = Getters<Config>;

// Conditional types with nested infer
type DeepExtract<T, U> = T extends { data: infer D }
  ? D extends { nested: infer N }
    ? N extends U
      ? N
      : never
    : never
  : never;

type DeepData = DeepExtract<
  { data: { nested: Status } },
  Status
>;

// Mapped conditional types
type NullableFields<T> = {
  [K in keyof T]: T[K] | null;
};

type OptionalNullable<T> = {
  [K in keyof T]?: T[K] | null;
};

// Template literal types with unions
type StatusPrefix = `status_${Status}`;
type ConfigKey = `config_${keyof Config}`;
type MetaKey = `meta_${keyof Meta}`;

// Recursive mapped types
type DeepRecord<K extends string | number | symbol, V> = {
  [P in K]: V | DeepRecord<K, V>;
};

type StatusTree = DeepRecord<Status, Config>;

// Distributive conditional types
type Flatten<T> = T extends Array<infer U> ? U : T;
type UnwrapArray<T> = T extends (infer U)[]
  ? U extends (infer V)[]
    ? V
    : U
  : T;

// Variadic tuple types
type PrependStatus<T extends readonly unknown[]> = [Status, ...T];
type AppendConfig<T extends readonly unknown[]> = [...T, Config];

type StatusFirst = PrependStatus<[Config, Meta]>;
type ConfigLast = AppendConfig<[Status, Meta]>;

// Mapped types with filtering
type RequiredKeys<T> = {
  [K in keyof T]-?: T[K];
};

type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

// Complex intersection with mapped types
type MergeDeep<T, U> = {
  [K in keyof T | keyof U]: K extends keyof T
    ? K extends keyof U
      ? T[K] | U[K]
      : T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

type MergedConfig = MergeDeep<Config, { value: string; extra: boolean }>;

// Conditional types with constraints
type ExtractByType<T, U> = T extends U ? T : never;
type ExcludeByType<T, U> = T extends U ? never : T;

type OnlyStatus = ExtractByType<Status | Config | Meta, Status>;
type NotStatus = ExcludeByType<Status | Config | Meta, Status>;

// Higher-order mapped types
type Transform<T, F> = {
  [K in keyof T]: F extends (x: T[K]) => infer R ? R : T[K];
};

// Recursive conditional with mapped
type DeepNonNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};

// Template literal with mapped
type PropEventMap<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

type ConfigEvents = PropEventMap<Config>;

// Conditional mapped with key remapping
type RenameKeys<T, M extends Record<string, string>> = {
  [K in keyof T as K extends keyof M ? M[K] : K]: T[K];
};

// Export complex class using all these types
export class ExtremeService {
  // Basic internal types
  status: Status;
  config: Config;
  meta: Meta;

  // Nested mapped types
  readonlyNested: DeepReadonly<NestedConfig>;
  partialNested: DeepPartial<NestedConfig>;

  // Getters
  getters: ConfigGetters;

  // Deep extraction
  deepData: DeepData;

  // Nullable variants
  nullableConfig: NullableFields<Config>;
  optionalNullable: OptionalNullable<Config>;

  // Template literals
  statusPrefix: StatusPrefix;
  configKey: ConfigKey;
  metaKey: MetaKey;

  // Recursive types
  statusTree: StatusTree;

  // Tuple types
  statusFirst: StatusFirst;
  configLast: ConfigLast;

  // Filtered types
  requiredConfig: RequiredKeys<Config>;

  // Merged types
  mergedConfig: MergedConfig;

  // Extracted types
  onlyStatus: OnlyStatus;

  // Events
  configEvents: ConfigEvents;

  constructor() {
    this.status = "on";
    this.config = { value: 42 };
    this.meta = { id: "test" };
    this.readonlyNested = {
      outer: { value: 1 },
      inner: { config: { value: 2 }, status: "on" },
    };
    this.partialNested = {};
    this.getters = { getValue: () => 42 };
    this.deepData = "on";
    this.nullableConfig = { value: null };
    this.optionalNullable = {};
    this.statusPrefix = "status_on";
    this.configKey = "config_value";
    this.metaKey = "meta_id";
    this.statusTree = { on: { value: 1 }, off: { value: 0 } };
    this.statusFirst = ["on", { value: 1 }, { id: "1" }];
    this.configLast = ["on", { id: "1" }, { value: 1 }];
    this.requiredConfig = { value: 1 };
    this.mergedConfig = { value: 1, extra: true };
    this.onlyStatus = "on";
    this.configEvents = { onValueChange: () => {} };
  }

  // Generic method with complex constraints
  transform<T extends Config, U extends Status>(
    config: T,
    status: U
  ): DeepReadonly<{ config: T; status: U }> {
    return { config, status };
  }

  // Method with mapped type return
  getEvents(): PropEventMap<Config> {
    return this.configEvents;
  }

  // Method with conditional type
  extract<T extends Status | Config>(
    value: T
  ): T extends Status ? boolean : number {
    return (typeof value === "string" ? true : 42) as any;
  }
}

// Generic class with complex constraints
export class Container<
  T extends Status = Status,
  C extends Config = Config,
  M extends Meta = Meta
> {
  status: T;
  config: C;
  meta: M;

  // Nested mapped type property
  readonly: DeepReadonly<{ status: T; config: C; meta: M }>;

  constructor(status: T, config: C, meta: M) {
    this.status = status;
    this.config = config;
    this.meta = meta;
    this.readonly = { status, config, meta };
  }

  // Method returning complex mapped type
  asNullable(): NullableFields<{ status: T; config: C; meta: M }> {
    return {
      status: this.status,
      config: this.config,
      meta: this.meta,
    };
  }

  // Method with conditional return type
  getByType<K extends "status" | "config" | "meta">(
    key: K
  ): K extends "status"
    ? T
    : K extends "config"
    ? C
    : K extends "meta"
    ? M
    : never {
    return this[key] as any;
  }
}

// Export function with complex return type
export function createExtreme(): {
  service: ExtremeService;
  container: Container;
  nested: DeepReadonly<NestedConfig>;
  events: PropEventMap<Config>;
} {
  const service = new ExtremeService();
  const container = new Container("on", { value: 1 }, { id: "1" });
  return {
    service,
    container,
    nested: service.readonlyNested,
    events: service.configEvents,
  };
}
