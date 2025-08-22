"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateFormPage() {
  const router = useRouter();

  const createForm = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const fields = JSON.parse(formData.get("fields") as string);

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { data, error } = await supabase
      .from("forms")
      .insert({
        title,
        description,
        fields,
        owner_id: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    router.push(`/dashboard/forms`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Form</h1>
      <form action={createForm} className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="fields">Fields (JSON)</Label>
          <Textarea id="fields" name="fields" rows={10} required />
        </div>
        <Button type="submit">Create Form</Button>
      </form>
    </div>
  );
}
