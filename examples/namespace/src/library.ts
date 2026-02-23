/**
 * Example library that will be exposed as a namespace
 */

export interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

export class HttpClient {
  constructor(private config: Config) {}

  async get<T>(url: string): Promise<T> {
    // Mock implementation
    return {} as T;
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    // Mock implementation
    return {} as T;
  }
}

export const VERSION = '1.0.0';
