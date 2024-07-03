import { Claim, ClaimPayload } from "../data/claim";
import { Repo, RepoPayload } from "../data/repo";
import { VoteType } from "../data/vote";
import { Coupon, VotePayload } from "./types";
import * as anchor from "@coral-xyz/anchor";

export class Adapter {
  static repo(repo: Repo): RepoPayload {
    return {
      name: repo.name,
      branch: repo.branch,
      owner: repo.owner,
    };
  }

  static claim(
    repo: Repo,
    claim: Claim,
    coupon: Coupon
  ): { claim: ClaimPayload; repo: RepoPayload; coupon: Coupon } {
    return {
      repo: this.repo(repo),
      claim: {
        ...claim,
        commits: new anchor.BN(claim.commits),
        timestamp: new anchor.BN(claim.timestamp),
      },
      coupon,
    };
  }

  static voteRepo({
    userId,
    voteType,
    repo,
    timestamp,
  }: {
    userId: string;
    voteType: VoteType;
    repo: Repo;
    timestamp: number;
  }): VotePayload {
    return {
      userId: userId.toString(),
      repo: this.repo(repo),
      timestamp: new anchor.BN(timestamp),
      voteType: {
        [voteType]: {},
      },
    };
  }
}
