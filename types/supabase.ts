export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chats: {
        Row: {
          driver_id: string
          id: string
          image: string | null
          mechanic_id: string
          message: string | null
          order_id: string | null
          sender_id: string | null
          sender_type: string
          sent_at: string | null
        }
        Insert: {
          driver_id: string
          id: string
          image?: string | null
          mechanic_id: string
          message?: string | null
          order_id?: string | null
          sender_id?: string | null
          sender_type: string
          sent_at?: string | null
        }
        Update: {
          driver_id?: string
          id?: string
          image?: string | null
          mechanic_id?: string
          message?: string | null
          order_id?: string | null
          sender_id?: string | null
          sender_type?: string
          sent_at?: string | null
        }
      }
      drivers: {
        Row: {
          createdAt: string | null
          email: string
          id: string
          image: string | null
          latitude: number | null
          longitude: number | null
          name: string
          phoneNumber: string
        }
        Insert: {
          createdAt?: string | null
          email: string
          id: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          phoneNumber: string
        }
        Update: {
          createdAt?: string | null
          email?: string
          id?: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          phoneNumber?: string
        }
      }
      mechanics: {
        Row: {
          availableDays: string[] | null
          availableTime: Json | null
          createdAt: string | null
          email: string
          id: string
          image: string | null
          isBooked: boolean | null
          latitude: number
          longitude: number
          name: string
          phoneNumber: string
        }
        Insert: {
          availableDays?: string[] | null
          availableTime?: Json | null
          createdAt?: string | null
          email: string
          id: string
          image?: string | null
          isBooked?: boolean | null
          latitude: number
          longitude: number
          name: string
          phoneNumber: string
        }
        Update: {
          availableDays?: string[] | null
          availableTime?: Json | null
          createdAt?: string | null
          email?: string
          id?: string
          image?: string | null
          isBooked?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          phoneNumber?: string
        }
      }
      orders: {
        Row: {
          createdAt: string | null
          description: string
          driverId: string | null
          id: string
          latitude: number | null
          longitude: number | null
          mechanicId: string | null
          progress: string
          state: string
          title: string
        }
        Insert: {
          createdAt?: string | null
          description: string
          driverId?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mechanicId?: string | null
          progress?: string
          state?: string
          title: string
        }
        Update: {
          createdAt?: string | null
          description?: string
          driverId?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mechanicId?: string | null
          progress?: string
          state?: string
          title?: string
        }
      }
      reviews: {
        Row: {
          createdAt: string | null
          driverId: string | null
          id: string
          mechanicId: string | null
          orderId: string | null
          rating: number | null
          review: string
        }
        Insert: {
          createdAt?: string | null
          driverId?: string | null
          id?: string
          mechanicId?: string | null
          orderId?: string | null
          rating?: number | null
          review: string
        }
        Update: {
          createdAt?: string | null
          driverId?: string | null
          id?: string
          mechanicId?: string | null
          orderId?: string | null
          rating?: number | null
          review?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
