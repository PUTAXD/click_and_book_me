"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface PageItem {
  id: string; // uuid
  owner_id: string | null; // uuid
  title: string | null; // text
  slug: string | null; // text
  content: object | null; // jsonb
  is_published: boolean; // bool
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  booking_intro: string | null;
  time_section: number | null;
  day_open: object | null; // Assuming JSONB for day_open
  meet_point: string | null;
}

export default function PagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newBookingIntro, setNewBookingIntro] = useState("");
  const [newTimeSection, setNewTimeSection] = useState<number | "">("");
  const [newDayOpen, setNewDayOpen] = useState(""); // For simplicity, treat as string for now
  const [newMeetPoint, setNewMeetPoint] = useState("");

  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editBookingIntro, setEditBookingIntro] = useState("");
  const [editTimeSection, setEditTimeSection] = useState<number | "">("");
  const [editDayOpen, setEditDayOpen] = useState(""); // For simplicity, treat as string for now
  const [editMeetPoint, setEditMeetPoint] = useState("");

  const [isNewPageDialogOpen, setIsNewPageDialogOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const { data, error } = await supabase.from("pages").select("*");
    if (error) {
      console.error("Error fetching pages:", error);
    } else {
      setPages(data as PageItem[]);
    }
  };

  const handleAddPage = async () => {
    if (newTitle.trim() === "" || newSlug.trim() === "") return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated.");
      return;
    }

    const { data, error } = await supabase
      .from("pages")
      .insert([
        {
          owner_id: user.id,
          title: newTitle,
          slug: newSlug,
          content: {}, // Default empty JSONB
          is_published: false,
          booking_intro: newBookingIntro || null,
          time_section: newTimeSection === "" ? null : newTimeSection,
          day_open: newDayOpen ? JSON.parse(newDayOpen) : null,
          meet_point: newMeetPoint || null,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding page:", error);
    } else if (data) {
      setPages([...pages, data[0] as PageItem]);
      setNewTitle("");
      setNewSlug("");
      setNewBookingIntro("");
      setNewTimeSection("");
      setNewDayOpen("");
      setNewMeetPoint("");
      setIsNewPageDialogOpen(false); // Close dialog on success
    }
  };

  const handleDeletePage = async (id: string) => {
    const { error } = await supabase.from("pages").delete().eq("id", id);
    if (error) {
      console.error("Error deleting page:", error);
    } else {
      setPages(pages.filter((page) => page.id !== id));
    }
  };

  const handleEditClick = (page: PageItem) => {
    setEditingPageId(page.id);
    setEditTitle(page.title || "");
    setEditSlug(page.slug || "");
    setEditBookingIntro(page.booking_intro || "");
    setEditTimeSection(page.time_section || "");
    setEditDayOpen(page.day_open ? JSON.stringify(page.day_open) : "");
    setEditMeetPoint(page.meet_point || "");
  };

  const handleUpdatePage = async () => {
    if (
      editingPageId === null ||
      editTitle.trim() === "" ||
      editSlug.trim() === ""
    )
      return;

    const { data, error } = await supabase
      .from("pages")
      .update({
        title: editTitle,
        slug: editSlug,
        booking_intro: editBookingIntro || null,
        time_section: editTimeSection === "" ? null : editTimeSection,
        day_open: editDayOpen ? JSON.parse(editDayOpen) : null,
        meet_point: editMeetPoint || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingPageId)
      .select();

    if (error) {
      console.error("Error updating page:", error);
    } else if (data) {
      setPages(
        pages.map((page) =>
          page.id === editingPageId ? (data[0] as PageItem) : page
        )
      );
      setEditingPageId(null);
      setEditTitle("");
      setEditSlug("");
      setEditBookingIntro("");
      setEditTimeSection("");
      setEditDayOpen("");
      setEditMeetPoint("");
    }
  };

  const handleCancelEdit = () => {
    setEditingPageId(null);
    setEditTitle("");
    setEditSlug("");
    setEditBookingIntro("");
    setEditTimeSection("");
    setEditDayOpen("");
    setEditMeetPoint("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Pages</h1>

      {/* Edit Page Card */}
      {editingPageId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Edit Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editTitle">Page Title</Label>
                <Input
                  id="editTitle"
                  placeholder="Title of your page"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editSlug">Page Slug</Label>
                <Input
                  id="editSlug"
                  placeholder="Slug for your page (e.g., my-awesome-page)"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editBookingIntro">Booking Intro</Label>
                <Textarea
                  id="editBookingIntro"
                  placeholder="Introduction for booking section"
                  value={editBookingIntro}
                  onChange={(e) => setEditBookingIntro(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editTimeSection">Time Section (minutes)</Label>
                <Input
                  id="editTimeSection"
                  type="number"
                  placeholder="Duration of each time slot"
                  value={editTimeSection}
                  onChange={(e) =>
                    setNewTimeSection(parseInt(e.target.value) || "")
                  }
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editDayOpen">Day Open (JSON)</Label>
                <Textarea
                  id="editDayOpen"
                  placeholder='{"monday": true, "tuesday": false}'
                  value={editDayOpen}
                  onChange={(e) => setEditDayOpen(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="editMeetPoint">Meet Point</Label>
                <Input
                  id="editMeetPoint"
                  placeholder="Meeting point for bookings"
                  value={editMeetPoint}
                  onChange={(e) => setEditMeetPoint(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdatePage}>Update Page</Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Existing Pages</CardTitle>
          <Dialog
            open={isNewPageDialogOpen}
            onOpenChange={setIsNewPageDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingPageId(null);
                  setNewTitle("");
                  setNewSlug("");
                  setNewBookingIntro("");
                  setNewTimeSection("");
                  setNewDayOpen("");
                  setNewMeetPoint("");
                }}
              >
                Create New Page
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Page</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newTitle">Page Title</Label>
                  <Input
                    id="newTitle"
                    placeholder="Title of your page"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newSlug">Page Slug</Label>
                  <Input
                    id="newSlug"
                    placeholder="Slug for your page (e.g., my-awesome-page)"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newBookingIntro">Booking Intro</Label>
                  <Textarea
                    id="newBookingIntro"
                    placeholder="Introduction for booking section"
                    value={newBookingIntro}
                    onChange={(e) => setNewBookingIntro(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newTimeSection">Time Section (minutes)</Label>
                  <Input
                    id="newTimeSection"
                    type="number"
                    placeholder="Duration of each time slot"
                    value={newTimeSection}
                    onChange={(e) =>
                      setNewTimeSection(parseInt(e.target.value) || "")
                    }
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newDayOpen">Day Open (JSON)</Label>
                  <Textarea
                    id="newDayOpen"
                    placeholder='{"monday": true, "tuesday": false}'
                    value={newDayOpen}
                    onChange={(e) => setNewDayOpen(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="newMeetPoint">Meet Point</Label>
                  <Input
                    id="newMeetPoint"
                    placeholder="Meeting point for bookings"
                    value={newMeetPoint}
                    onChange={(e) => setNewMeetPoint(e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleAddPage}>Add Page</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {pages.length === 0 ? (
            <p>No pages created yet.</p>
          ) : (
            <ul className="space-y-4">
              {pages.map((page) => (
                <li
                  key={page.id}
                  className="flex justify-between items-center p-4 border rounded-md shadow-sm"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{page.title}</h3>
                    <p className="text-gray-600">Slug: {page.slug}</p>
                    {page.booking_intro && (
                      <p className="text-gray-600 text-sm">
                        Intro: {page.booking_intro}
                      </p>
                    )}
                    {page.time_section !== null && (
                      <p className="text-gray-600 text-sm">
                        Time Section: {page.time_section} minutes
                      </p>
                    )}
                    {page.day_open && (
                      <p className="text-gray-600 text-sm">
                        Days Open: {JSON.stringify(page.day_open)}
                      </p>
                    )}
                    {page.meet_point && (
                      <p className="text-gray-600 text-sm">
                        Meet Point: {page.meet_point}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditClick(page)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeletePage(page.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
