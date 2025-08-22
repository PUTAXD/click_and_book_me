"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function FormPage({ params }: { params: { form_id: string } }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("forms")
        .select("*")
        .eq("id", params.form_id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setForm(data);
      }
      setLoading(false);
    };

    fetchForm();
  }, [params.form_id]);

  const submitForm = async (formData: FormData) => {
    const values: { [key: string]: any } = {};
    form.fields.forEach((field: any) => {
      values[field.name] = formData.get(field.name);
    });

    const supabase = createClient();
    const { error } = await supabase.from("submissions").insert({
      form_id: params.form_id,
      values,
    });

    if (error) {
      console.error(error);
    } else {
      alert("Form submitted successfully!");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!form) {
    return <div>Form not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
      <p className="mb-4">{form.description}</p>
      <form action={submitForm} className="grid gap-4">
        {form.fields.map((field: any) => (
          <div key={field.name} className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              required={field.required}
            />
          </div>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
