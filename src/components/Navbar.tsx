import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { UserCircleIcon } from "lucide-react";
import Image from "next/image";

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profilePictureUrl = "/default-avatar.png"; // Default avatar

  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("url_picture")
      .eq("id", user.id)
      .single();

    if (profileData?.url_picture) {
      profilePictureUrl = profileData.url_picture;
      console.log(profileData.url_picture);
    }
  }

  return (
    <header className="p-4 flex justify-between items-center border-b">
      <nav>
        <ul className="flex gap-4">
          <li>
            <Link href="/home">Home</Link>
          </li>
          <li>
            <Link href="/pages">Pages</Link>
          </li>
          <li>
            <Link href="/bookings">Bookings</Link>
          </li>
        </ul>
      </nav>
      <div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative h-8 w-8 rounded-full cursor-pointer">
                <Image
                  src={profilePictureUrl}
                  alt="Profile Picture"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              {user?.email && (
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
              )}
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form action="/auth/signout" method="post">
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start p-0"
                  >
                    Log out
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
