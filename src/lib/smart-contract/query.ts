import {
  AccountClient,
  AnchorError,
  Idl,
  Program,
  utils,
  web3,
} from "@coral-xyz/anchor";
import { Repo } from "../data/repo";
import { PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Vote, VoteAdapter } from "../data/vote";
import { Subscription } from "../data/subscription";
import { config } from "@/config";

interface Accounts {
  repo: AccountClient;
  vote: AccountClient;
  subscription: AccountClient;
}

interface Responses<T> {
  account: T;
  publicKey: PublicKey;
}

export class Query {
  private static instance: Query;
  private accounts: Accounts;
  private program: Program<Idl>;
  private wallet: AnchorWallet;

  constructor(program: Program<Idl>, wallet: AnchorWallet) {
    this.accounts = program.account as Accounts;
    this.program = program;
    this.wallet = wallet;
  }

  private adapt<T>(response: Responses<T>): T {
    return {
      ...response.account,
      publicKey: response.publicKey,
    };
  }

  async getRepos(): Promise<Repo[]> {
    const accounts = await this.accounts.repo.all();

    return accounts.map((accounts: Responses<Repo>) =>
      this.adapt<Repo>(accounts)
    );
  }

  async refetchRepo(publicKey: PublicKey): Promise<Repo> {
    const account = await this.accounts.repo.fetch(publicKey);

    return this.adapt<Repo>({ account, publicKey });
  }

  async getVote(userId: number, repo: Repo): Promise<Vote | null> {
    const [votePda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("vote"),
        Buffer.from(userId.toString()),
        repo.publicKey.toBuffer(),
      ],
      this.program.programId
    );

    try {
      const account = await this.accounts.vote.fetch(votePda);
      return this.adapt<Vote>({
        account: VoteAdapter.fromResponse(account),
        publicKey: votePda,
      });
    } catch (e) {
      console.log((e as unknown as AnchorError).message);
      return null;
    }
  }

  async getSubscription(
    userId: number,
    repo: Repo
  ): Promise<Subscription | undefined> {
    const [subPda] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("sub"),
        Buffer.from(userId.toString()),
        repo.publicKey.toBuffer(),
      ],
      this.program.programId
    );

    try {
      const account = await this.accounts.subscription.fetch(subPda);
      return this.adapt<Subscription>({
        account,
        publicKey: subPda,
      });
    } catch (e) {
      console.log((e as unknown as AnchorError).message);
      return undefined;
    }
  }

  async getBalance(address?: string) {
    const tokenAddress = Query.getAta(
      address ?? this.wallet.publicKey.toString()
    );
    try {
      const info =
        await this.program.provider.connection.getTokenAccountBalance(
          tokenAddress
        );
      return info.value.uiAmount;
    } catch (e) {
      return 0;
    }
  }

  static getAta(address: string | PublicKey) {
    const owner =
      typeof address === "string" ? new PublicKey(address) : address;
    const tokenAddress = utils.token.associatedAddress({
      mint: config.mint,
      owner: owner,
    });

    return tokenAddress;
  }

  static getQuery(program: Program<Idl>, wallet: AnchorWallet): Query {
    if (!Query.instance) {
      Query.instance = new Query(program, wallet);
    }

    return Query.instance;
  }
}
