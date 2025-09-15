import { createClient } from "@/lib/supabase/server"; // atau client kalau mau CSR
import { Tables } from "@/lib/supabase/db"; // hasil dari db.ts

type Page = Tables<"pages">;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: pages, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true) // optional: hanya ambil kalau published
    .limit(1); // Changed from .single()

  const page = pages?.[0]; // Get the first item from the array

  if (error || !page) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <h1 className="text-xl font-bold">Page not found</h1>
        <p className="text-gray-600">{error?.message ?? "No data"}</p>
      </div>
    );
  }
  console.log(page);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
      <p className="mb-2">{page.booking_intro}</p>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(page.content, null, 2)}
      </pre>
    </div>
  );
}
