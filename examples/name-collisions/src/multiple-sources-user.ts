/**
 * User module with its own internal Status type
 */
type Status = "active" | "inactive";

export class User {
  status: Status;  // Should use THIS file's Status ("active" | "inactive")
  name: string;

  constructor(name: string) {
    this.name = name;
    this.status = "active";
  }

  isActive(): boolean {
    return this.status === "active";
  }
}
