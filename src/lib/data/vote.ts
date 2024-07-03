import { PublicKey } from "@solana/web3.js";

export enum VoteType {
  up = "up",
  down = "down",
}

export interface Vote {
  bump: number;
  voteType: VoteType;
  voter: PublicKey;
  repoPda: PublicKey;
}

export class VoteAdapter {
  static fromResponse(response: any): Vote {
    return { ...response, voteType: Object.keys(response.voteType)[0] };
  }
}
