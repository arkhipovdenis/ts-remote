/**
 * Payment module with yet another DIFFERENT internal Status type
 */
type Status = "authorized" | "captured" | "refunded";

export class Payment {
  status: Status;  // Should use THIS file's Status ("authorized" | "captured" | "refunded")
  amount: number;

  constructor(amount: number) {
    this.amount = amount;
    this.status = "authorized";
  }

  capture(): void {
    this.status = "captured";
  }
}
