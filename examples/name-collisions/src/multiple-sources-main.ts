/**
 * Main module that imports all three classes and exports its own Status
 */
import { User } from "./multiple-sources-user";
import { Order } from "./multiple-sources-order";
import { Payment } from "./multiple-sources-payment";

// Export all three classes
export { User, Order, Payment };

// Export our own Status type (different from all internal ones!)
export type Status = "success" | "error" | "warning";

// Use the exported Status in a new class
export class Response {
  status: Status;  // Should use exported Status ("success" | "error" | "warning")
  message: string;

  constructor(message: string) {
    this.message = message;
    this.status = "success";
  }
}

// Export a type that uses all classes
export type Application = {
  user: User;      // User.status should be "active" | "inactive"
  order: Order;    // Order.status should be "pending" | "shipped" | "delivered"
  payment: Payment; // Payment.status should be "authorized" | "captured" | "refunded"
  response: Response; // Response.status should be "success" | "error" | "warning"
};
