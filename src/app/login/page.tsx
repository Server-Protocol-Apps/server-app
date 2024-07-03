"use client";

import { Button } from "@/components/Button";
import { Loading } from "@/components/Loading";
import { useSignMsg } from "@/lib/hooks/useSignMsg";
import { makeId } from "@/utils/string";
import { useLocalStorage, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const route = useRouter();
  const [waitingForGitHub, setWaitingForGitHub] = useState(false);
  const { publicKey, signMessage } = useWallet();
  const [_, persistNonce] = useLocalStorage<string | undefined>(
    "nonce",
    undefined
  );

  const { signMsg, msgSignature, error } = useSignMsg({
    publicKey,
    signMessage,
  });

  useEffect(() => {
    if (msgSignature) persistNonce(msgSignature);
  }, [msgSignature, persistNonce]);

  const onSignIn = () => {
    const msg = `We need you to sign this message in order to log in\n\n${makeId(
      10
    )}`;
    signMsg(msg);
  };

  const onConnect = () => {
    setWaitingForGitHub(true);
    route.push(
      "https://github.com/login/oauth/authorize" +
        `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}` +
        `&state=${msgSignature}&scope=user:email`
    );
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {!publicKey && <span>Connect your wallet</span>}
      {publicKey && !msgSignature && (
        <Button onClick={onSignIn}>Sign In</Button>
      )}
      {error && publicKey && (
        <span className="text-red-500	text-sm">
          Your signature is required to proceed, please try again
        </span>
      )}
      {publicKey &&
        msgSignature &&
        (!waitingForGitHub ? (
          <Button onClick={onConnect}>Connect with GitHub</Button>
        ) : (
          <Loading text="Connecting" />
        ))}
    </div>
  );
}
