// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./db";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const createClient = async (cookieStore = cookies()) => {
  const cookiesResult = await cookieStore;
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookiesResult.getAll();
      },
      setAll(cookiesToSet) {
        try {
          // Ini akan error di Server Component, tapi aman di Route Handler
          cookiesToSet.forEach(({ name, value, options }) => {
            cookiesResult.set(name, value, options);
          });
        } catch {
          // Server Component tidak boleh set cookie — ini aman diabaikan
        }
      },
    },
  });
};
