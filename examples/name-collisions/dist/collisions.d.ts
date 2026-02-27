declare module "app" {
/**
 * Internal module with Role type used internally
 */
type Role_1 = "admin" | "default";
class User {
    role: Role_1;
    constructor(role: Role_1);
}
type Role = "admin" | "default" | "moderator";
function createApp(): {
    user: User;
};
export { Role, createApp, User };
}

declare module "complex-collisions" {
/**
 * Internal types that will be used but not exported from the module
 */
type Status_1 = "active" | "inactive";
const CONSTANT = 42;
class Service {
    status: Status_1;
    config: Config;
    logger: Logger;
    value: typeof CONSTANT;
    constructor();
}
type Status = "pending" | "completed" | "failed";
interface Config {
    name: string;
    version: number;
}
class Logger {
    name: string;
    constructor(name: string);
    write(text: string): void;
}
export { Status, Config, Logger, CONSTANT, Service };
}

declare module "complex-collisions-v2" {
/**
 * Internal types - using type aliases instead of interfaces/classes
 */
type Status_1 = "active" | "inactive";
type Config_1 = {
    enabled: boolean;
};
type CONSTANT_1 = 42;
class Service {
    status: Status_1;
    config: Config_1;
    logger: Logger;
    value: CONSTANT_1;
    constructor();
}
type Status = "pending" | "completed" | "failed";
type Config = {
    name: string;
    version: number;
};
type Logger = {
    write: (text: string) => void;
};
type CONSTANT = "different value";
export { Status, Config, Logger, CONSTANT, Service };
}

declare module "advanced-collisions" {
/**
 * Advanced internal types with complex TypeScript constructs
 */
type Status_1 = "active" | "inactive";
type Config_1 = {
    enabled: boolean;
};
type StatusResult<T> = T extends Status_1 ? "valid" : "invalid";
type ReadonlyConfig = {
    readonly [K in keyof Config_1]: Config_1[K];
};
type PartialLogger = Partial<Logger>;
type StatusMessage = `status-${Status_1}`;
type ConfigEnabled = Config_1["enabled"];
type ConfigWithStatus = Config_1 & {
    status: Status_1;
};
type LoggerOrConfig = Logger | Config_1;
type Container<T extends Config_1> = {
    data: T;
    status: Status_1;
};
type NestedStatus = {
    current: Status_1;
    previous?: NestedStatus;
};
type StatusChecker = (status: Status_1) => boolean;
type ConfigFactory = () => Config_1;
type LoggerFactory<T extends Logger = Logger> = (name: string) => T;
type ExtractStatus<T> = T extends {
    status: infer S;
} ? S : never;
type StatusFromChecker = ExtractStatus<{
    status: Status_1;
}>;
type StatusTuple = [Status_1, Config_1, Logger];
type NamedStatusTuple = [status: Status_1, config: Config_1];
type StatusArray = Status_1[];
type ConfigRecord = Record<string, Config_1>;
class AdvancedService {
    status: Status_1;
    config: Config_1;
    logger: Logger;
    statusResult: StatusResult<Status_1>;
    readonlyConfig: ReadonlyConfig;
    partialLogger: PartialLogger;
    statusMessage: StatusMessage;
    configEnabled: ConfigEnabled;
    configWithStatus: ConfigWithStatus;
    loggerOrConfig: LoggerOrConfig;
    container: Container<Config_1>;
    nestedStatus: NestedStatus;
    checker: StatusChecker;
    configFactory: ConfigFactory;
    loggerFactory: LoggerFactory;
    statusFromChecker: StatusFromChecker;
    statusTuple: StatusTuple;
    namedTuple: NamedStatusTuple;
    statusArray: StatusArray;
    configRecord: ConfigRecord;
    constructor();
    getStatus(): Status_1;
    updateConfig(config: Config_1): void;
    setLogger(logger: Logger): void;
    processContainer<T extends Config_1>(container: Container<T>): Status_1;
    updatePartial(partial: Partial<Config_1>): void;
    checkStatus<T>(value: T): StatusResult<T>;
}
class TypedContainer<T extends Status_1 = Status_1> {
    value: T;
    config: Config_1;
    constructor(value: T);
    getValue(): T;
    getConfig(): Config_1;
}
function createService(): {
    service: AdvancedService;
    status: Status_1;
    config: ReadonlyConfig;
};
type Status = "pending" | "completed" | "failed" | "cancelled";
type Config = {
    name: string;
    version: number;
    settings: {
        debug: boolean;
    };
};
type Logger = {
    level: "info" | "warn" | "error";
    write: (message: string) => void;
    flush: () => void;
};
type ReadonlyStatus = Readonly<Status>;
type PartialConfig = Partial<Config>;
type RequiredLogger = Required<Logger>;
type IsStatus<T> = T extends Status ? true : false;
type ExtractConfigValue<K extends keyof Config> = Config[K];
type LogLevel = `log-${Logger["level"]}`;
type StatusEvent = `status:${Status}`;
type ConfigKeys = keyof Config;
type LoggerValues = Logger[keyof Logger];
type ServiceConfig = Config & {
    status: Status;
    logger: Logger;
};
type AnyConfig = Config | {
    legacy: true;
};
type StatusOrLogger = Status | Logger;
type Response<T = Status> = {
    data: T;
    config: Config;
    timestamp: number;
};
type AsyncResult<T extends Status = Status> = Promise<{
    status: T;
    logger: Logger;
}>;
type StatusValidator = (status: Status) => boolean;
type ConfigTransformer = (config: Config) => Config;
type LoggerProvider = () => Logger;
type ConfigMap = {
    [K in keyof Config]: Config[K] extends object ? Partial<Config[K]> : Config[K];
};
type StatusRecord = Record<Status, Config>;
type OptionalConfig<T extends keyof Config> = {
    [K in T]?: Config[K];
};
type HttpStatus = `http-${Status}-${number}`;
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type ExtractData<T> = T extends {
    data: infer D;
} ? D : never;
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
type DeepConfig = DeepPartial<Config>;
class PublicService {
    status: Status;
    config: Config;
    logger: Logger;
    constructor(status: Status, config: Config, logger: Logger);
    getStatus(): Status;
    updateConfig(config: Config): void;
    setLogger(logger: Logger): void;
}
function createPublicService(): PublicService;
type CombinedService = {
    advanced: AdvancedService;
    public: PublicService;
    status: Status;
    config: Config;
};
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type Result = {
    status: Extract<Status, "completed">;
    data: Config;
} | {
    status: Extract<Status, "failed">;
    error: string;
} | {
    status: Extract<Status, "pending">;
};
type Getter<out T> = () => T;
type Setter<in T> = (value: T) => void;
type GetSet<in out T> = {
    get: () => T;
    set: (value: T) => void;
};
type StatusGetter = Getter<Status>;
type ConfigSetter = Setter<Config>;
export { Status, Config, Logger, ReadonlyStatus, PartialConfig, RequiredLogger, IsStatus, ExtractConfigValue, LogLevel, StatusEvent, ConfigKeys, LoggerValues, ServiceConfig, AnyConfig, StatusOrLogger, Response, AsyncResult, StatusValidator, ConfigTransformer, LoggerProvider, ConfigMap, StatusRecord, OptionalConfig, HttpStatus, UnwrapPromise, ExtractData, DeepPartial, DeepConfig, AdvancedService, TypedContainer, createService, PublicService, createPublicService, CombinedService, Awaited, Result, Getter, Setter, GetSet, StatusGetter, ConfigSetter };
}

declare module "extreme-collisions" {
/**
 * Extreme edge cases for collision resolution
 */
type Status_1 = "on" | "off";
type Config_1 = {
    value: number;
};
type Meta_1 = {
    id: string;
};
type DeepReadonly_1<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly_1<T[K]> : T[K];
};
type DeepPartial_1<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial_1<T[K]> : T[K];
};
type NestedConfig = {
    outer: Config_1;
    inner: {
        config: Config_1;
        status: Status_1;
    };
};
type ConfigGetters_1 = Getters<Config_1>;
type DeepExtract<T, U> = T extends {
    data: infer D;
} ? D extends {
    nested: infer N;
} ? N extends U ? N : never : never : never;
type DeepData = DeepExtract<{
    data: {
        nested: Status_1;
    };
}, Status_1>;
type NullableFields<T> = {
    [K in keyof T]: T[K] | null;
};
type OptionalNullable<T> = {
    [K in keyof T]?: T[K] | null;
};
type StatusPrefix = `status_${Status_1}`;
type ConfigKey = `config_${keyof Config_1}`;
type MetaKey = `meta_${keyof Meta_1}`;
type DeepRecord<K extends string | number | symbol, V> = {
    [P in K]: V | DeepRecord<K, V>;
};
type StatusTree_1 = DeepRecord<Status_1, Config_1>;
type PrependStatus<T extends readonly unknown[]> = [Status_1, ...T];
type AppendConfig<T extends readonly unknown[]> = [...T, Config_1];
type StatusFirst = PrependStatus<[Config_1, Meta_1]>;
type ConfigLast = AppendConfig<[Status_1, Meta_1]>;
type RequiredKeys<T> = {
    [K in keyof T]-?: T[K];
};
type MergeDeep<T, U> = {
    [K in keyof T | keyof U]: K extends keyof T ? K extends keyof U ? T[K] | U[K] : T[K] : K extends keyof U ? U[K] : never;
};
type MergedConfig = MergeDeep<Config_1, {
    value: string;
    extra: boolean;
}>;
type ExtractByType<T, U> = T extends U ? T : never;
type OnlyStatus = ExtractByType<Status_1 | Config_1 | Meta_1, Status_1>;
type PropEventMap<T> = {
    [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
type ConfigEvents = PropEventMap<Config_1>;
class ExtremeService {
    status: Status_1;
    config: Config_1;
    meta: Meta_1;
    readonlyNested: DeepReadonly_1<NestedConfig>;
    partialNested: DeepPartial_1<NestedConfig>;
    getters: ConfigGetters_1;
    deepData: DeepData;
    nullableConfig: NullableFields<Config_1>;
    optionalNullable: OptionalNullable<Config_1>;
    statusPrefix: StatusPrefix;
    configKey: ConfigKey;
    metaKey: MetaKey;
    statusTree: StatusTree_1;
    statusFirst: StatusFirst;
    configLast: ConfigLast;
    requiredConfig: RequiredKeys<Config_1>;
    mergedConfig: MergedConfig;
    onlyStatus: OnlyStatus;
    configEvents: ConfigEvents;
    constructor();
    transform<T extends Config_1, U extends Status_1>(config: T, status: U): DeepReadonly_1<{
        config: T;
        status: U;
    }>;
    getEvents(): PropEventMap<Config_1>;
    extract<T extends Status_1 | Config_1>(value: T): T extends Status_1 ? boolean : number;
}
class Container<T extends Status_1 = Status_1, C extends Config_1 = Config_1, M extends Meta_1 = Meta_1> {
    status: T;
    config: C;
    meta: M;
    readonly: DeepReadonly_1<{
        status: T;
        config: C;
        meta: M;
    }>;
    constructor(status: T, config: C, meta: M);
    asNullable(): NullableFields<{
        status: T;
        config: C;
        meta: M;
    }>;
    getByType<K extends "status" | "config" | "meta">(key: K): K extends "status" ? T : K extends "config" ? C : K extends "meta" ? M : never;
}
function createExtreme(): {
    service: ExtremeService;
    container: Container;
    nested: DeepReadonly_1<NestedConfig>;
    events: PropEventMap<Config_1>;
};
type Status = {
    type: "success";
    code: 200;
} | {
    type: "error";
    code: 400 | 500;
};
type Config = {
    apiKey: string;
    endpoint: URL;
    timeout: number;
    retries: number;
};
type Meta = {
    version: string;
    timestamp: Date;
    author: string;
};
type DeepReadonly<T> = T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;
type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;
type StatusType = Status["type"];
type ConfigKeys = keyof Config;
type MetaKeys = keyof Meta;
type ReadonlyStatus = Readonly<Status>;
type PartialConfig = Partial<Config>;
type RequiredMeta = Required<Meta>;
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
type AsyncFields<T> = {
    [K in keyof T]: Promise<T[K]>;
};
type IsSuccess<T> = T extends {
    type: "success";
} ? true : false;
type ExtractCode<T> = T extends {
    code: infer C;
} ? C : never;
type Result<T> = {
    status: Extract<Status, {
        type: "success";
    }>;
    data: T;
} | {
    status: Extract<Status, {
        type: "error";
    }>;
    error: string;
};
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;
type Unwrap<T> = T extends (infer U)[] ? U : T;
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};
type Setters<T> = {
    [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
type ConfigGetters = Getters<Config>;
type ConfigSetters = Setters<Config>;
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiRoute = `/${string}`;
type Endpoint = `${HttpMethod} ${ApiRoute}`;
type ApiConfig = Config & {
    headers: Record<string, string>;
    method: HttpMethod;
};
type ApiMeta = Meta & {
    requestId: string;
    duration: number;
};
type Tree<T> = {
    value: T;
    children?: Tree<T>[];
};
type StatusTree = Tree<Status>;
type ConfigTree = Tree<Config>;
type Prepend<T extends readonly unknown[], U> = [U, ...T];
type Append<T extends readonly unknown[], U> = [...T, U];
type Transformer<T, U> = {
    [K in keyof T]: U;
};
type Validator<T> = {
    [K in keyof T]: (value: T[K]) => boolean;
};
type FilterByType<T, U> = {
    [K in keyof T as T[K] extends U ? K : never]: T[K];
};
type OmitByType<T, U> = {
    [K in keyof T as T[K] extends U ? never : K]: T[K];
};
type EventName<T> = {
    [K in keyof T]: `on${Capitalize<string & K>}Change`;
}[keyof T];
type ConfigEventName = EventName<Config>;
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;
type ExtractReturn<T> = T extends (...args: any[]) => infer R ? R : never;
type Provider<out T> = () => T;
type Consumer<in T> = (value: T) => void;
type Mutable<in out T> = {
    get: () => T;
    set: (value: T) => void;
};
class ApiService {
    status: Status;
    config: Config;
    meta: Meta;
    constructor(status: Status, config: Config, meta: Meta);
    getStatus(): Status;
    updateConfig(config: Partial<Config>): void;
    setMeta(meta: Meta): void;
}
function createSuccess<T>(data: T): Result<T>;
function createError<T>(error: string): Result<T>;
type CombinedService = {
    extreme: ExtremeService;
    api: ApiService;
    status: Status;
    config: Config;
    meta: Meta;
};
type AsyncService<T extends Config = Config> = {
    config: T;
    getConfig: () => Promise<T>;
    updateConfig: (config: Partial<T>) => Promise<void>;
    validate: (config: T) => Promise<boolean>;
};
type Operation<T = unknown> = {
    kind: "read";
    path: string;
} | {
    kind: "write";
    path: string;
    data: T;
} | {
    kind: "delete";
    path: string;
};
type ConfigOperation = Operation<Config>;
type Brand<T, B> = T & {
    __brand: B;
};
type StatusId = Brand<string, "StatusId">;
type ConfigId = Brand<number, "ConfigId">;
export { Status, Config, Meta, DeepReadonly, DeepPartial, StatusType, ConfigKeys, MetaKeys, ReadonlyStatus, PartialConfig, RequiredMeta, Nullable, AsyncFields, IsSuccess, ExtractCode, Result, Awaited, Unwrap, Getters, Setters, ConfigGetters, ConfigSetters, HttpMethod, ApiRoute, Endpoint, ApiConfig, ApiMeta, Tree, StatusTree, ConfigTree, Prepend, Append, Transformer, Validator, FilterByType, OmitByType, EventName, ConfigEventName, UnwrapPromise, ExtractReturn, Provider, Consumer, Mutable, ExtremeService, Container, createExtreme, ApiService, createSuccess, createError, CombinedService, AsyncService, Operation, ConfigOperation, Brand, StatusId, ConfigId };
}

declare module "multiple-sources" {
/**
 * User module with its own internal Status type
 */
type Status_1 = "active" | "inactive";
class User {
    status: Status_1;
    name: string;
    constructor(name: string);
    isActive(): boolean;
}
/**
 * Order module with its own DIFFERENT internal Status type
 */
type Status_2 = "pending" | "shipped" | "delivered";
class Order {
    status: Status_2;
    id: number;
    constructor(id: number);
    ship(): void;
}
/**
 * Payment module with yet another DIFFERENT internal Status type
 */
type Status_3 = "authorized" | "captured" | "refunded";
class Payment {
    status: Status_3;
    amount: number;
    constructor(amount: number);
    capture(): void;
}
type Status = "success" | "error" | "warning";
class Response {
    status: Status;
    message: string;
    constructor(message: string);
}
type Application = {
    user: User;
    order: Order;
    payment: Payment;
    response: Response;
};
export { User, Order, Payment, Status, Response, Application };
}

declare module "namespace-test" {
/**
 * Utility module with types to be imported as namespace
 */
type Status = "loading" | "ready" | "error";
type Config = {
    timeout: number;
    retries: number;
};
/**
 * Internal module with types that will collide
 */
type Status_1 = "active" | "inactive";
type Config_1 = {
    enabled: boolean;
};
class InternalService {
    status: Status_1;
    config: Config_1;
    constructor();
}
class NamespaceService {
    status: Status;
    config: Config;
    constructor();
}
export { NamespaceService, InternalService, Utils, Status, Config };
namespace Utils {
    /**
     * Test import * as namespace with collision resolution
     */
    type Status = "loading" | "ready" | "error";
    type Config = {
        timeout: number;
        retries: number;
    };
    function createStatus(): Status;
    function createConfig(): Config;
}
}

declare module "namespace-export-test" {
/**
 * Internal module for namespace export test
 */
type Status_1 = "active" | "inactive";
class Service {
    status: Status_1;
    constructor();
}
namespace Utils {
    /**
     * Test export * as namespace syntax with collision resolution
     */
    type Status = "loading" | "ready" | "error";
    type Config = {
        timeout: number;
        retries: number;
    };
    function createStatus(): Status;
    function createConfig(): Config;
}
type Status = "success" | "failure";
type Config = {
    apiKey: string;
};
export { Service, Utils, Status, Config };
}
