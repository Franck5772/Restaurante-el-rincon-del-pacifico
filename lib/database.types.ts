export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      menu_items: {
        Row: {
          id: number
          name: string
          description: string
          price: number
          category: string
          image_url?: string
          available: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description: string
          price: number
          category: string
          image_url?: string
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string
          price?: number
          category?: string
          image_url?: string
          available?: boolean
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          customer_name: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: number
          customer_name: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: number
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          menu_item_id: number
          quantity: number
          price: number
          notes: string
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          menu_item_id: number
          quantity: number
          price: number
          notes?: string
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          menu_item_id?: number
          quantity?: number
          price?: number
          notes?: string
          created_at?: string
        }
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
  }
}