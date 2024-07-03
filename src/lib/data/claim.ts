import * as borsh from "borsh";
import * as anchor from "@coral-xyz/anchor";

export interface Claim {
  commits: number;
  timestamp: number;
  userId: string;
}

export interface ClaimPayload {
  commits: anchor.BN;
  timestamp: anchor.BN;
  userId: string;
}

export class ClaimAdapter {
  static schema = {
    struct: { commits: "u64", timestamp: "u128", userId: "string" },
  };

  static serialize(claim: ClaimPayload): Uint8Array {
    return borsh.serialize(this.schema, claim);
  }
}
