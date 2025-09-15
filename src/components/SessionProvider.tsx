"use client";

import { createContext, useContext } from "react";
import { Session } from "@supabase/supabase-js";

interface SessionContextType {
  session: Session | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
