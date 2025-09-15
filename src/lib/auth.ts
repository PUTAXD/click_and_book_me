import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { Session } from "@supabase/supabase-js";

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
