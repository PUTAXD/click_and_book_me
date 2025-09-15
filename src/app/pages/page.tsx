"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionProvider";
import {
  fetchPagesApi,
  createPageApi,
  deletePageApi,
  BookMePageInsert,
  Page,
} from "@/lib/api/pages";

export default function NewBookMePage() {
  const { session } = useSession();

  const [form, setForm] = useState<
    Partial<BookMePageInsert> & { day_open_raw?: string; content_raw?: string }
  >({
    title: "",
    slug: "",
    booking_intro: "",
    time_section: 0,
    day_open_raw: "",
    meet_point: "",
    content_raw: "",
    is_published: false,
  });

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    handleFetchPages();
  }, [session]);

  async function handleFetchPages() {
    setLoading(true);
    const { pages: fetchedPages, error } = await fetchPagesApi(session);

    if (error) {
      setMessage(error);
      setPages([]);
    } else {
      setPages(fetchedPages);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { message: successMessage, error } = await createPageApi(
      form,
      session
    );

    if (error) {
      setMessage(error);
    } else {
      setMessage(successMessage);
      setForm({
        title: "",
        slug: "",
        booking_intro: "",
        time_section: 0,
        day_open_raw: "",
        meet_point: "",
        content_raw: "",
        is_published: false,
      });
      handleFetchPages(); // Refresh the list of pages
    }
    setLoading(false);
  }

  async function handleDelete(pageId: string) {
    setLoading(true);
    setMessage("");

    const { message: successMessage, error } = await deletePageApi(pageId);

    if (error) {
      setMessage(error);
    } else {
      setMessage(successMessage);
      handleFetchPages(); // Refresh the list of pages
    }
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Buat BookMePage Baru</h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Slug</label>
          <input
            type="text"
            value={form.slug ?? ""}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Booking Intro</label>
          <textarea
            value={form.booking_intro ?? ""}
            onChange={(e) =>
              setForm({ ...form, booking_intro: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Time Section</label>
          <input
            type="number"
            value={form.time_section ?? 0}
            onChange={(e) =>
              setForm({ ...form, time_section: parseInt(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Day Open (JSON)</label>
          <textarea
            value={form.day_open_raw ?? ""}
            onChange={(e) => setForm({ ...form, day_open_raw: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Meet Point</label>
          <input
            type="text"
            value={form.meet_point ?? ""}
            onChange={(e) => setForm({ ...form, meet_point: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1">Content (JSON)</label>
          <textarea
            value={form.content_raw ?? ""}
            onChange={(e) => setForm({ ...form, content_raw: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={form.is_published ?? false}
            onChange={(e) =>
              setForm({ ...form, is_published: e.target.checked })
            }
            className="mr-2"
          />
          <label>Is Published</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mb-4 mt-8">Existing BookMe Pages</h2>
      {loading && <p>Loading pages...</p>}
      {!loading && pages.length === 0 && <p>No pages created yet.</p>}
      {!loading && pages.length > 0 && (
        <ul className="space-y-4">
          {pages.map((page) => (
            <li
              key={page.id}
              className="flex justify-between items-center border p-4 rounded-lg shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{page.title}</h3>
                <p className="text-sm text-gray-600">Slug: {page.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(page.id)}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
