import { Loading } from "@/components/Loading";
import { useCallback, useState } from "react";
import { TxnSignature } from "../smart-contract/txn_signature";

export type LoadingText = "Signing" | "Waiting" | "Querying" | "Loading";

export const useLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState<LoadingText>();

  const wait = useCallback(
    async <T,>(text: LoadingText, fn: () => Promise<T>): Promise<T> => {
      setText(text);
      setIsLoading(true);
      const result = await fn();
      setIsLoading(false);
      return result;
    },
    []
  );

  const sign = useCallback(
    <T,>(fn: () => Promise<T>): Promise<T> => {
      return wait<T>("Signing", fn);
    },
    [wait]
  );

  const query = useCallback(
    <T,>(fn: () => Promise<T>): Promise<T> => {
      return wait<T>("Querying", fn);
    },
    [wait]
  );

  const loading = useCallback(
    <T,>(fn: () => Promise<T>): Promise<T> => {
      return wait<T>("Loading", fn);
    },
    [wait]
  );

  const confirmation = useCallback(
    async (tx: TxnSignature, callback: () => void): Promise<void> => {
      setText("Waiting");
      setIsLoading(true);
      tx.wait(() => {
        setIsLoading(false);
        callback();
      });
    },
    []
  );

  return {
    sign,
    query,
    confirmation,
    loading: isLoading && <Loading text={text} />,
  };
};
