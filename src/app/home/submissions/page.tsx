import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function SubmissionsPage() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const { data: submissions } = await supabase
    .from("submissions")
    .select("*, forms(title)")
    .eq("forms.owner_id", session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Submissions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Form</TableHead>
            <TableHead>Values</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions?.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <Link href={`/dashboard/submissions/${submission.id}`}>
                  {submission.forms.title}
                </Link>
              </TableCell>
              <TableCell>
                <pre>{JSON.stringify(submission.values, null, 2)}</pre>
              </TableCell>
              <TableCell>
                <Badge>{submission.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
