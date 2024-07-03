"use client";

import { create } from "zustand";
import { useEffect } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { SmartContract } from "@/lib/smart-contract";
import { useNotify } from "@/lib/hooks/useNotify";
import {
  AnchorProvider,
  Idl,
  Program,
  Provider,
  getProvider,
} from "@coral-xyz/anchor";
import idl from "../../smart_contract.json";
import { Loading } from "../Loading";
import { Balance } from "@/lib/hooks/useBalance";
import { useProgramStore } from "@/store/smart_contract";

export const SmartContractProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const { connection } = useConnection();
  const notify = useNotify();
  const wallet = useAnchorWallet();

  const client = useProgramStore((state) => state.client);
  const setClient = useProgramStore((state) => state.setClient);

  useEffect(() => {
    if (client) return;
    let provider: Provider;
    if (!wallet) return;
    try {
      provider = getProvider();
    } catch {
      provider = new AnchorProvider(connection, wallet, {});
    }

    const program = new Program(idl as Idl, provider);

    setClient(
      SmartContract.getSmartContract(program, wallet, {
        notify,
      })
    );
  }, [client, connection, wallet, notify, setClient]);

  return children;
};
