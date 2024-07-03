"use client";

import { Session } from "@/session";
import { useSessionStore } from "@/store/session";
import { useEffect } from "react";

export const SessionProvider = ({
  session,
  children,
}: {
  session: Session | null;
  children?: React.ReactNode;
}) => {
  const setSession = useSessionStore((state) => state.setSession);

  useEffect(() => {
    setSession(session);
  }, [session, setSession]);

  return children;
};
