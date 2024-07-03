import { Loading } from "@/components/Loading";
import { useProgramStore } from "@/store/smart_contract";
import { useCallback, useEffect } from "react";

export interface Balance {
  amount: number;
  loading?: React.ReactNode;
}

export const useBalance = () => {
  const { client, balance, setBalance } = useProgramStore();

  const updateBalance = useCallback(async () => {
    if (!client) return;
    setBalance({ loading: <Loading text="Loading" />, amount: 0 });
    const balance = await client.query.getBalance();
    setBalance({ loading: null, amount: balance ?? 0 });
  }, [client, setBalance]);

  useEffect(() => {
    updateBalance();
  }, [client, updateBalance]);

  return { updateBalance, balance };
};
