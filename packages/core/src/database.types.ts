// File GENERATO dallo schema Supabase — non modificare a mano.
// Rigenerare con: pnpm --filter @ilovewellness/core gen:types   (vedi docs/10-sviluppo.md)
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      availability_exceptions: {
        Row: {
          ends_at: string
          id: string
          provider_id: string
          reason: string | null
          starts_at: string
        }
        Insert: {
          ends_at: string
          id?: string
          provider_id: string
          reason?: string | null
          starts_at: string
        }
        Update: {
          ends_at?: string
          id?: string
          provider_id?: string
          reason?: string | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_exceptions_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_rules: {
        Row: {
          end_time: string
          id: string
          location_id: string | null
          provider_id: string
          service_id: string | null
          start_time: string
          weekday: number
        }
        Insert: {
          end_time: string
          id?: string
          location_id?: string | null
          provider_id: string
          service_id?: string | null
          start_time: string
          weekday: number
        }
        Update: {
          end_time?: string
          id?: string
          location_id?: string | null
          provider_id?: string
          service_id?: string | null
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_rules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_rules_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          cancellation_reason: string | null
          cancelled_at: string | null
          client_id: string
          client_note: string | null
          commission_cents: number
          created_at: string
          currency: string
          during: unknown
          ends_at: string
          exclusive: boolean
          id: string
          location_id: string | null
          payment_mode: Database["public"]["Enums"]["payment_mode"]
          price_cents: number
          provider_id: string
          service_id: string
          service_name: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_id: string
          client_note?: string | null
          commission_cents?: number
          created_at?: string
          currency?: string
          during?: unknown
          ends_at: string
          exclusive?: boolean
          id?: string
          location_id?: string | null
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          price_cents: number
          provider_id: string
          service_id: string
          service_name: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          cancellation_reason?: string | null
          cancelled_at?: string | null
          client_id?: string
          client_note?: string | null
          commission_cents?: number
          created_at?: string
          currency?: string
          during?: unknown
          ends_at?: string
          exclusive?: boolean
          id?: string
          location_id?: string | null
          payment_mode?: Database["public"]["Enums"]["payment_mode"]
          price_cents?: number
          provider_id?: string
          service_id?: string
          service_name?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          description: string | null
          icon: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
        }
        Insert: {
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
        }
        Update: {
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_message_at: string | null
          provider_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          provider_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_message_at?: string | null
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          provider_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          provider_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          provider_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string
          created_at: string
          geo: unknown
          id: string
          is_primary: boolean
          label: string | null
          lat: number | null
          lng: number | null
          postal_code: string | null
          provider_id: string
          province: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          geo: unknown
          id?: string
          is_primary?: boolean
          label?: string | null
          lat?: never
          lng?: never
          postal_code?: string | null
          provider_id: string
          province?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          geo?: unknown
          id?: string
          is_primary?: boolean
          label?: string | null
          lat?: never
          lng?: never
          postal_code?: string | null
          provider_id?: string
          province?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_path: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          attachment_path?: string | null
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          attachment_path?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string
          id: string
          is_admin: boolean
          marketing_consent: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id: string
          is_admin?: boolean
          marketing_consent?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_admin?: boolean
          marketing_consent?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      provider_categories: {
        Row: {
          category_id: string
          provider_id: string
        }
        Insert: {
          category_id: string
          provider_id: string
        }
        Update: {
          category_id?: string
          provider_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_categories_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      provider_members: {
        Row: {
          created_at: string
          provider_id: string
          role: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          provider_id: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          provider_id?: string
          role?: Database["public"]["Enums"]["member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_members_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "provider_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          bio: string | null
          commission_bps: number
          contact_email: string | null
          contact_phone: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          display_name: string
          headline: string | null
          id: string
          instant_booking: boolean
          kind: Database["public"]["Enums"]["provider_kind"]
          languages: string[]
          legal_name: string | null
          min_notice_hours: number
          rating_avg: number
          rating_count: number
          search_vector: unknown
          slug: string
          stripe_account_id: string | null
          timezone: string
          updated_at: string
          vat_number: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          bio?: string | null
          commission_bps?: number
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          display_name: string
          headline?: string | null
          id?: string
          instant_booking?: boolean
          kind: Database["public"]["Enums"]["provider_kind"]
          languages?: string[]
          legal_name?: string | null
          min_notice_hours?: number
          rating_avg?: number
          rating_count?: number
          search_vector?: unknown
          slug: string
          stripe_account_id?: string | null
          timezone?: string
          updated_at?: string
          vat_number?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          bio?: string | null
          commission_bps?: number
          contact_email?: string | null
          contact_phone?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          display_name?: string
          headline?: string | null
          id?: string
          instant_booking?: boolean
          kind?: Database["public"]["Enums"]["provider_kind"]
          languages?: string[]
          legal_name?: string | null
          min_notice_hours?: number
          rating_avg?: number
          rating_count?: number
          search_vector?: unknown
          slug?: string
          stripe_account_id?: string | null
          timezone?: string
          updated_at?: string
          vat_number?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "providers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_type: Database["public"]["Enums"]["report_target"]
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          author_id: string | null
          author_name: string
          body: string | null
          booking_id: string
          created_at: string
          id: string
          provider_id: string
          provider_replied_at: string | null
          provider_reply: string | null
          rating: number
          status: Database["public"]["Enums"]["review_status"]
        }
        Insert: {
          author_id?: string | null
          author_name: string
          body?: string | null
          booking_id: string
          created_at?: string
          id?: string
          provider_id: string
          provider_replied_at?: string | null
          provider_reply?: string | null
          rating: number
          status?: Database["public"]["Enums"]["review_status"]
        }
        Update: {
          author_id?: string | null
          author_name?: string
          body?: string | null
          booking_id?: string
          created_at?: string
          id?: string
          provider_id?: string
          provider_replied_at?: string | null
          provider_reply?: string | null
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
        }
        Relationships: [
          {
            foreignKeyName: "reviews_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          cancellation_policy: Database["public"]["Enums"]["cancellation_policy"]
          capacity: number
          category_id: string | null
          created_at: string
          description: string | null
          duration_min: number
          id: string
          is_active: boolean
          location_id: string | null
          mode: Database["public"]["Enums"]["service_mode"]
          name: string
          price_cents: number
          provider_id: string
          slot_step_min: number
          updated_at: string
        }
        Insert: {
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          capacity?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_min: number
          id?: string
          is_active?: boolean
          location_id?: string | null
          mode?: Database["public"]["Enums"]["service_mode"]
          name: string
          price_cents: number
          provider_id: string
          slot_step_min?: number
          updated_at?: string
        }
        Update: {
          cancellation_policy?: Database["public"]["Enums"]["cancellation_policy"]
          capacity?: number
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration_min?: number
          id?: string
          is_active?: boolean
          location_id?: string | null
          mode?: Database["public"]["Enums"]["service_mode"]
          name?: string
          price_cents?: number
          provider_id?: string
          slot_step_min?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_documents: {
        Row: {
          created_at: string
          doc_type: Database["public"]["Enums"]["document_type"]
          expires_on: string | null
          id: string
          notes: string | null
          provider_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["document_status"]
          storage_path: string
        }
        Insert: {
          created_at?: string
          doc_type: Database["public"]["Enums"]["document_type"]
          expires_on?: string | null
          id?: string
          notes?: string | null
          provider_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          storage_path: string
        }
        Update: {
          created_at?: string
          doc_type?: Database["public"]["Enums"]["document_type"]
          expires_on?: string | null
          id?: string
          notes?: string | null
          provider_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["document_status"]
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_documents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verification_documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      available_slots: {
        Args: { p_from: string; p_service_id: string; p_to: string }
        Returns: {
          ends_at: string
          starts_at: string
        }[]
      }
      booking_transition: {
        Args: {
          p_booking_id: string
          p_reason?: string
          p_status: Database["public"]["Enums"]["booking_status"]
        }
        Returns: Database["public"]["Tables"]["bookings"]["Row"]
        SetofOptions: {
          from: "*"
          to: "bookings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      can_view_profile: { Args: { p_profile_id: string }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_conversation_participant: {
        Args: { p_conversation_id: string }
        Returns: boolean
      }
      is_provider_member: { Args: { p_provider_id: string }; Returns: boolean }
      is_provider_owner: { Args: { p_provider_id: string }; Returns: boolean }
      mark_conversation_read: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      provider_is_public: { Args: { p_provider_id: string }; Returns: boolean }
      reply_to_review: {
        Args: { p_reply: string; p_review_id: string }
        Returns: Database["public"]["Tables"]["reviews"]["Row"]
        SetofOptions: {
          from: "*"
          to: "reviews"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      search_providers: {
        Args: {
          p_category?: string
          p_lat?: number
          p_limit?: number
          p_lng?: number
          p_max_price?: number
          p_offset?: number
          p_online?: boolean
          p_query?: string
          p_radius_km?: number
        }
        Returns: {
          category_names: string[]
          city: string
          cover_url: string
          display_name: string
          distance_km: number
          has_online: boolean
          headline: string
          id: string
          instant_booking: boolean
          kind: Database["public"]["Enums"]["provider_kind"]
          lat: number
          lng: number
          min_price_cents: number
          rating_avg: number
          rating_count: number
          slug: string
        }[]
      }
      set_provider_verification: {
        Args: {
          p_provider_id: string
          p_status: Database["public"]["Enums"]["verification_status"]
        }
        Returns: undefined
      }
      submit_provider_for_review: {
        Args: { p_provider_id: string }
        Returns: undefined
      }
    }
    Enums: {
      booking_status:
        | "awaiting_payment"
        | "pending"
        | "confirmed"
        | "cancelled_by_client"
        | "cancelled_by_provider"
        | "completed"
        | "no_show"
        | "disputed"
      cancellation_policy: "flexible" | "moderate" | "strict"
      document_status: "pending" | "approved" | "rejected"
      document_type:
        | "identity"
        | "training"
        | "association"
        | "insurance"
        | "license"
        | "other"
      member_role: "owner" | "staff"
      payment_mode: "online" | "on_site"
      provider_kind: "individual" | "venue"
      report_status: "open" | "actioned" | "dismissed"
      report_target: "provider" | "review" | "message" | "user"
      review_status: "published" | "hidden"
      service_mode: "in_person" | "online" | "at_home"
      verification_status:
        | "draft"
        | "pending"
        | "verified"
        | "rejected"
        | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
