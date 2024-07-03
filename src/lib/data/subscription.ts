import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export interface Subscription {
  bump: number;
  lastClaim: anchor.BN;
  totalClaimed: anchor.BN;
  subscribedAt: anchor.BN;
  userId: string;
  repoPda: PublicKey;
  publicKey: PublicKey;
}
