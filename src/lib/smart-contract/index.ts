import { Idl, Program, Wallet } from "@coral-xyz/anchor";
import { Instructions } from "./instructions";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Query } from "./query";
import { Notify } from "../hooks/useNotify";
export type StateManagers = {
  notify: Notify;
};

export class SmartContract {
  private static instance: SmartContract;
  public instructions: Instructions;
  public query: Query;

  private constructor(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ) {
    this.instructions = Instructions.getInstructions(program, wallet, state);
    this.query = Query.getQuery(program, wallet);
  }

  static getSmartContract(
    program: Program<Idl>,
    wallet: AnchorWallet,
    state: StateManagers
  ): SmartContract {
    if (!SmartContract.instance) {
      SmartContract.instance = new SmartContract(program, wallet, state);
    }

    return SmartContract.instance;
  }
}
