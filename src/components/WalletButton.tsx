"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Fetchers } from "@/utils/fetchers";

const ReactUIWalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const WalletButton = () => {
  const route = useRouter();
  const { disconnecting, publicKey, connecting } = useWallet();
  const triedToConnect = useRef(false);

  const logOut = async () => {
    await Fetchers.POST(["/logout", {}]);
    window.location.href = `${window.location.origin}/login`;
  };

  useEffect(() => {
    if (disconnecting || (triedToConnect.current && !publicKey)) logOut();
    if (connecting) triedToConnect.current = true;
  }, [disconnecting, route, publicKey, connecting, triedToConnect]);

  return <ReactUIWalletMultiButtonDynamic />;
};
