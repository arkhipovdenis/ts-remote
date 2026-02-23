declare module "my-app" {
/**
 * Example application entry point
 */
interface User {
    id: string;
    name: string;
    email: string;
}
function getUser(id: string): Promise<User>;
function createUser(name: string, email: string): User;
export { User, getUser, createUser };
}

declare module "utils" {
/**
 * Utility functions
 */
function formatDate(date: Date): string;
function capitalize(str: string): string;
function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void;
export { formatDate, capitalize, debounce };
}
