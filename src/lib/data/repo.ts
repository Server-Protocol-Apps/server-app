import { PublicKey } from "@solana/web3.js";
import * as borsh from "borsh";
import * as anchor from "@coral-xyz/anchor";

export interface RepoPayload {
  name: string;
  owner: string;
  branch: string;
}

export interface Repo {
  name: string;
  owner: string;
  branch: string;
  approvedTimestamp: anchor.BN;
  votes: anchor.BN;
  totalClaimed: anchor.BN;
  subscribers: anchor.BN;
  bump: number;
  proposedTimestamp: anchor.BN;
  approved: boolean;
  publisher: PublicKey;
  publicKey: PublicKey;
}

export const eqRepo = (repo1: Repo, repo2: Repo) => {
  return (
    repo1.name === repo2.name &&
    repo1.owner === repo1.owner &&
    repo1.branch === repo2.branch
  );
};

export class RepoAdapter {
  static schema = {
    struct: { owner: "string", name: "string", branch: "string" },
  };

  static serialize(repo: RepoPayload): Uint8Array {
    return borsh.serialize(this.schema, repo);
  }
}
