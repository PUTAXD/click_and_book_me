"use client";

import Image from "next/image";
import { useSession } from "@/components/SessionProvider";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/lib/supabase/db";
import { useState, useEffect } from "react";

export default function Page() {
  const { session } = useSession();
  const supabase = createClient();

  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [session, supabase]);

  return (
    <div>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
}
