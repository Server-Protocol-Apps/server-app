import { ed25519 } from "@noble/curves/ed25519";
import { type PublicKey } from "@solana/web3.js";
import { useNotify } from "./useNotify";
import base58 from "bs58";
import { useEffect, useState } from "react";

interface Props {
  signMessage: ((message: Uint8Array) => Promise<Uint8Array>) | undefined;
  publicKey: PublicKey | null;
}

export const useSignMsg = ({ signMessage, publicKey }: Props) => {
  const notify = useNotify();
  const [msgSignature, setMsgSignature] = useState<string>();
  const [waiting, setWaiting] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!publicKey) setMsgSignature(undefined);
  }, [publicKey]);

  const signMsg = async (message: string) => {
    if (!publicKey || !signMessage || msgSignature || waiting) return;
    setWaiting(true);
    try {
      const encodedMsg = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMsg);
      if (!ed25519.verify(signature, encodedMsg, publicKey.toBytes()))
        throw new Error("Message signature invalid!");
      const msgSig = base58.encode(signature);

      setMsgSignature(msgSig);
      setError(false);
      notify("success", `Message signed`);
    } catch (error: any) {
      notify("error", `${error?.message}`);
      setError(true);
    }
    setWaiting(false);
  };

  return { signMsg, msgSignature, error };
};
