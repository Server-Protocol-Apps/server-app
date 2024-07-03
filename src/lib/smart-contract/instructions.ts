import { Idl, Program } from "@coral-xyz/anchor";
import { Repo, RepoAdapter } from "../data/repo";
import { Adapter } from "./adapter";
import { VoteType } from "../data/vote";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AddRepoPayload, Coupon } from "./types";
import { TxnSignature } from "./txn_signature";
import * as anchor from "@coral-xyz/anchor";
import { StateManagers } from ".";
import { ClaimPayload } from "../data/claim";
import { Query } from "./query";

export class Instructions {
  private static instance: Instructions;
  private program: Program<Idl>;
  private wallet: AnchorWallet;
  private state: StateManagers;

  private constructor(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ) {
    this.program = program;
    this.wallet = wallet;
    this.state = state;
  }

  private async guard(fn: () => Promise<string>) {
    try {
      const sig = await fn();
      return new TxnSignature(this.program, sig, this.state);
    } catch (e: any) {
      this.state.notify("error", e.error.errorMessage ?? e.error.message);
    }
  }

  async propose(payload: AddRepoPayload): Promise<TxnSignature | undefined> {
    return this.guard(() =>
      this.program.methods
        .addRepo(payload)
        .accounts({ publisher: this.wallet.publicKey })
        .rpc()
    );
  }

  async vote(
    githubId: number,
    repo: Repo,
    voteType: VoteType
  ): Promise<TxnSignature | undefined> {
    return this.guard(() =>
      this.program.methods
        .voteRepo(
          Adapter.voteRepo({
            userId: githubId.toString(),
            repo,
            voteType,
            timestamp: Date.now(),
          })
        )
        .accounts({
          voter: this.wallet.publicKey,
        })
        .rpc()
    );
  }

  async subscribe(
    repo: Repo,
    userId: number,
    coupon: Coupon
  ): Promise<TxnSignature | undefined> {
    return this.guard(() =>
      this.program.methods
        .subscribe({
          repo: Adapter.repo(repo),
          coupon,
          userId: userId.toString(),
          timestamp: new anchor.BN(Date.now()),
        })
        .accounts({
          signer: this.wallet.publicKey,
        })
        .rpc()
    );
  }

  async claim(
    repo: Repo,
    claim: ClaimPayload,
    coupon: Coupon
  ): Promise<TxnSignature | undefined> {
    const destination = Query.getTokenAddress(this.wallet.publicKey);
    return this.guard(() =>
      this.program.methods
        .claimRewards(Adapter.claim(repo, claim, coupon))
        .accounts({
          destination,
        })
        .rpc()
    );
  }

  static getInstructions(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ): Instructions {
    if (!Instructions.instance) {
      Instructions.instance = new Instructions(program, wallet, state);
    }

    return Instructions.instance;
  }
}
