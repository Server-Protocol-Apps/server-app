"use client";

import { useBalance } from "@/lib/hooks/useBalance";

export const Balance = () => {
  const { balance } = useBalance();

  return (
    <div className="ml-32">
      <span>Balance: {balance.loading ?? balance.amount}</span>
    </div>
  );
};
