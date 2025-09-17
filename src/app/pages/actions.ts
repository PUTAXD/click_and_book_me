"use server";

import {
  fetchPagesApi,
  createPageApi,
  deletePageApi,
  BookMePageInsert,
  Page,
} from "@/lib/api/pages";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Helper to get session in server actions
async function getSession() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function serverFetchPages(): Promise<{
  pages: Page[];
  error: string | null;
}> {
  const session = await getSession();
  return fetchPagesApi(session);
}

export async function serverCreatePage(
  form: Partial<BookMePageInsert> & {
    day_open_raw?: string;
    content_raw?: string;
  }
): Promise<{ message: string; error: string | null }> {
  const session = await getSession();
  return createPageApi(form, session);
}

export async function serverDeletePage(
  pageId: string
): Promise<{ message: string; error: string | null }> {
  return deletePageApi(pageId);
}
