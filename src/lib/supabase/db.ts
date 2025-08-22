export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: string;
          full_name: string | null;
          business_name: string | null;
          slug: string | null;
          url_picture: string | null;
        };
        Insert: {
          id: string;
          role: string;
          full_name?: string | null;
          business_name?: string | null;
          slug?: string | null;
          url_picture?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          full_name?: string | null;
          business_name?: string | null;
          slug?: string | null;
          url_picture?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pages: {
        Row: {
          id: string;
          owner_id: string | null;
          title: string | null;
          slug: string | null;
          content: Json | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
          booking_intro: string | null;
          time_section: number | null;
          day_open: Json | null;
          meet_point: string | null;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          title?: string | null;
          slug?: string | null;
          content?: Json | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          booking_intro?: string | null;
          time_section?: number | null;
          day_open?: Json | null;
          meet_point?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          title?: string | null;
          slug?: string | null;
          content?: Json | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
          booking_intro?: string | null;
          time_section?: number | null;
          day_open?: Json | null;
          meet_point?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pages_owner_id_fkey";
            columns: ["owner_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
