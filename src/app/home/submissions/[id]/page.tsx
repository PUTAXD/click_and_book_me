"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubmissionPage({ params }: { params: { id: string } }) {
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSubmission = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("submissions")
        .select("*, forms(title)")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error(error);
      } else {
        setSubmission(data);
      }
      setLoading(false);
    };

    fetchSubmission();
  }, [params.id]);

  const takeAction = async (formData: FormData) => {
    const action = formData.get("action") as string;
    const note = formData.get("note") as string;

    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return;
    }

    const { error } = await supabase.from("approvals").insert({
      submission_id: params.id,
      owner_id: session.user.id,
      action,
      note,
    });

    if (error) {
      console.error(error);
      return;
    }

    const { error: updateError } = await supabase
      .from("submissions")
      .update({ status: action })
      .eq("id", params.id);

    if (updateError) {
      console.error(updateError);
      return;
    }

    router.push("/dashboard/submissions");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!submission) {
    return <div>Submission not found</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {submission.forms.title} Submission
      </h1>
      <div className="mb-4">
        <pre>{JSON.stringify(submission.values, null, 2)}</pre>
      </div>
      <div className="mb-4">
        <Badge>{submission.status}</Badge>
      </div>
      <form action={takeAction} className="grid gap-4">
        <Textarea name="note" placeholder="Add a note..." />
        <div className="flex gap-2">
          <Button name="action" value="approved">
            Approve
          </Button>
          <Button name="action" value="rejected" variant="destructive">
            Reject
          </Button>
        </div>
      </form>
    </div>
  );
}
