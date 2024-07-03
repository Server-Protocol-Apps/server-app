import { Idl, Program } from "@coral-xyz/anchor";
import {
  Connection,
  SignatureStatus,
  TransactionSignature,
} from "@solana/web3.js";
import { StateManagers } from ".";

export class TxnSignature {
  private connection: Connection;
  private program: Program<Idl>;
  private lastSig?: TransactionSignature;
  private state: StateManagers;

  constructor(
    program: Program<Idl>,
    lastSig: TransactionSignature,
    state: StateManagers
  ) {
    this.program = program;
    this.connection = this.program.provider.connection;
    this.lastSig = lastSig;
    this.state = state;
  }

  private finished(status: SignatureStatus | null): boolean {
    if (status?.confirmationStatus === "finalized") {
      this.state.notify("success", "Txn confirmed");
      return true;
    }
    if (status?.err) {
      this.state.notify("error", status.err.toString());
      return true;
    }
    return false;
  }

  async wait(callback: () => void): Promise<NodeJS.Timeout> {
    const interval = setInterval(async () => {
      if (!this.lastSig) return;

      const result = await this.connection.getSignatureStatus(this.lastSig, {
        searchTransactionHistory: true,
      });

      if (this.finished(result.value)) {
        clearInterval(interval);
        return callback();
      }
    }, 1000);
    return interval;
  }

  async showLogs() {
    if (!this.lastSig) return;

    const latestBlockHash = await this.connection.getLatestBlockhash();
    await this.connection.confirmTransaction(
      {
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: this.lastSig,
      },
      "confirmed"
    );

    const txDetails = await this.program.provider.connection.getTransaction(
      this.lastSig,
      {
        maxSupportedTransactionVersion: 0,
        commitment: "confirmed",
      }
    );

    const logs = txDetails?.meta?.logMessages || null;
    console.log(logs);
  }
}
