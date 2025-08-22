import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function FormsPage() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: forms } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", session.user.id);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button asChild>
          <Link href="/dashboard/forms/create">Create Form</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms?.map((form) => (
          <div key={form.id} className="p-4 border rounded-md">
            <h2 className="text-lg font-semibold">{form.title}</h2>
            <p className="text-sm text-gray-500">{form.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
