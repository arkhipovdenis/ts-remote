/**
 * Example application entry point
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUser(id: string): Promise<User> {
  // Mock implementation
  return {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  };
}

export function createUser(name: string, email: string): User {
  return {
    id: Math.random().toString(36),
    name,
    email,
  };
}
