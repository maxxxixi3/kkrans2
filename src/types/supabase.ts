export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          destination_address: string
          id: string
          patient_id: string
          pickup_address: string
          scheduled_time: string
          status: string
          transport_type: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          destination_address: string
          id?: string
          patient_id: string
          pickup_address: string
          scheduled_time: string
          status?: string
          transport_type: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          destination_address?: string
          id?: string
          patient_id?: string
          pickup_address?: string
          scheduled_time?: string
          status?: string
          transport_type?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      Fahrer: {
        Row: {
          created_at: string
          id: string
          is_available: boolean | null
          license_number: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          license_number?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_available?: boolean | null
          license_number?: string | null
          profile_id?: string | null
        }
        Relationships: []
      }
      Fahrzeuge: {
        Row: {
          capacity: string | null
          created_at: string
          id: number
          is_available: boolean | null
          license_plate: string | null
          type: string | null
        }
        Insert: {
          capacity?: string | null
          created_at?: string
          id?: number
          is_available?: boolean | null
          license_plate?: string | null
          type?: string | null
        }
        Update: {
          capacity?: string | null
          created_at?: string
          id?: number
          is_available?: boolean | null
          license_plate?: string | null
          type?: string | null
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          birthdate: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          insurance_number: string | null
          last_name: string | null
          medical_notes: string | null
        }
        Insert: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id?: string
          insurance_number?: string | null
          last_name?: string | null
          medical_notes?: string | null
        }
        Update: {
          address?: string | null
          birthdate?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          insurance_number?: string | null
          last_name?: string | null
          medical_notes?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      rides: {
        Row: {
          appointment_time: string
          created_at: string | null
          end_address: string
          id: string
          notes: string | null
          patient_id: string | null
          start_address: string
          status: string | null
        }
        Insert: {
          appointment_time: string
          created_at?: string | null
          end_address: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          start_address: string
          status?: string | null
        }
        Update: {
          appointment_time?: string
          created_at?: string | null
          end_address?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          start_address?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          email: string
          id: string
          role: string | null
        }
        Insert: {
          email: string
          id?: string
          role?: string | null
        }
        Update: {
          email?: string
          id?: string
          role?: string | null
        }
        Relationships: []
      }
      transports: {
        Row: {
          created_at: string
          destination: string | null
          driver_id: string | null
          end_time: string | null
          id: number
          notes: string | null
          patient_id: string | null
          pickup_address: string | null
          start_time: string | null
          status: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          destination?: string | null
          driver_id?: string | null
          end_time?: string | null
          id?: number
          notes?: string | null
          patient_id?: string | null
          pickup_address?: string | null
          start_time?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          destination?: string | null
          driver_id?: string | null
          end_time?: string | null
          id?: number
          notes?: string | null
          patient_id?: string | null
          pickup_address?: string | null
          start_time?: string | null
          status?: string | null
          vehicle_id?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          license_plate: string
          name: string
          tuev_date: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          license_plate: string
          name: string
          tuev_date?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          license_plate?: string
          name?: string
          tuev_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
