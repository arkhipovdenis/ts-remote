declare namespace MyLibrary {
/**
 * Example library that will be exposed as a namespace
 */
interface Config {
    apiUrl: string;
    timeout: number;
    retries: number;
}
class HttpClient {
    constructor(config: Config);
    get<T>(url: string): Promise<T>;
    post<T>(url: string, data: unknown): Promise<T>;
}
const VERSION = "1.0.0";
export { Config, HttpClient, VERSION };
}
