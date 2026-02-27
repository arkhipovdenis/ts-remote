/**
 * Order module with its own DIFFERENT internal Status type
 */
type Status = "pending" | "shipped" | "delivered";

export class Order {
  status: Status;  // Should use THIS file's Status ("pending" | "shipped" | "delivered")
  id: number;

  constructor(id: number) {
    this.id = id;
    this.status = "pending";
  }

  ship(): void {
    this.status = "shipped";
  }
}
