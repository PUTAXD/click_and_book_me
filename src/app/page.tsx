import Image from "next/image";
import { createClient } from "@/lib/supabase/server"; // Use server-side client
import { Tables } from "@/lib/supabase/db";
import { cookies } from "next/headers"; // Import cookies

export default async function Page() {
  // Make component async
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore); // Instantiate server-side supabase client

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let profile: Tables<"profiles"> | null = null;

  if (session?.user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      profile = data;
    }
  }

  return (
    <div>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
