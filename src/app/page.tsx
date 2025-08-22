import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data: profile } = session
    ? await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()
    : { data: null };

  return (
    <div>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
      <Image
        src="https://lh3.googleusercontent.com/a/ACg8ocIaYvr95HIl9-aHizPbDPMnYiP3ltUns-iBH89gF0062Swvqtrp=s96-c"
        alt="Next.js Logo"
        width={180}
        height={37}
      />
    </div>
  );
}
