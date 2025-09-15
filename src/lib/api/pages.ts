import { createClient } from "@/lib/supabase/client";
import { Json, Tables, TablesInsert } from "@/lib/supabase/db";
import { Session } from "@supabase/supabase-js";

export type BookMePageInsert = TablesInsert<"pages">;
export type Page = Tables<"pages">;

const supabase = createClient();

export async function fetchPagesApi(
  session: Session | null
): Promise<{ pages: Page[]; error: string | null }> {
  if (!session?.user) {
    return { pages: [], error: "User not logged in." };
  }

  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("owner_id", session.user.id);

  if (error) {
    return { pages: [], error: `Error fetching pages: ${error.message}` };
  }

  return { pages: data || [], error: null };
}

export async function createPageApi(
  form: Partial<BookMePageInsert> & {
    day_open_raw?: string;
    content_raw?: string;
  },
  session: Session | null
): Promise<{ message: string; error: string | null }> {
  if (!session?.user) {
    return { message: "", error: "User not logged in." };
  }

  if (!form.title) {
    return { message: "", error: "Title is required." };
  }

  let parsedDayOpen: Json | null = null;
  if (form.day_open_raw) {
    try {
      parsedDayOpen = JSON.parse(form.day_open_raw);
    } catch (e) {
      return { message: "", error: "Invalid JSON for Day Open." };
    }
  }

  let parsedContent: Json | null = null;
  if (form.content_raw) {
    try {
      parsedContent = JSON.parse(form.content_raw);
    } catch (e) {
      return { message: "", error: "Invalid JSON for Content." };
    }
  }

  const { data, error } = await supabase.from("pages").insert({
    title: form.title,
    slug: form.slug,
    booking_intro: form.booking_intro,
    time_section: form.time_section,
    day_open: parsedDayOpen,
    meet_point: form.meet_point,
    content: parsedContent,
    is_published: form.is_published,
    owner_id: session.user.id,
  } as BookMePageInsert);

  if (error) {
    return { message: "", error: `Error creating page: ${error.message}` };
  }

  return { message: "Page created successfully!", error: null };
}

export async function deletePageApi(
  pageId: string
): Promise<{ message: string; error: string | null }> {
  const { error } = await supabase.from("pages").delete().eq("id", pageId);

  if (error) {
    return { message: "", error: `Error deleting page: ${error.message}` };
  }

  return { message: "Page deleted successfully!", error: null };
}
