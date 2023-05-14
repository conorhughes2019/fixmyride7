import { Database } from "./supabase";

export interface Driver {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface DriverUser {
  createdAt: string | null;
  email: string;
  id: string;
  image: string | null;
  latitude: number | null;
  longitude: number | null;
  name: string;
  phoneNumber: string;
}

export interface Mechanic {
  id: string;
  image: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  latitude: number;
  longitude: number;
  isBooked: boolean;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
}

export interface MechanicUser {
  id: string;
  image: string;
  name: string;
  phoneNumber: string;
  email: string;
  latitude: number;
  longitude: number;
  isBooked: boolean;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
}

export interface Order {
  driverId?: string | null;
  id?: string;
  latitude?: number | null;
  longitude?: number | null;
  mechanicId?: string | null;
  createdAt?: string | null;
  progress?: string;
  state?: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  driverId: string;
  mechanicId: string;
  review: string;
}

export interface Rating {
  id: string;
  driverId: string;
  mechanicId: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface DriverReview {
  createdAt: string;
  email: string;
  id: string;
  image: string;
  latitude: number;
  longitude: number;
  name: string;
  phoneNumber: string;
}

export interface RatingStats {
  averageRating: number;
  ratingPercentages: { [rating: number]: number };
}

export type DatabaseReview = Database["public"]["Tables"]["reviews"]["Row"];

export interface DatabaseReviewWithDriver extends DatabaseReview {
  drivers: {
    name: string;
    image: string;
  };
}

export type MessageType = Database["public"]["Tables"]["chats"]["Row"];
export type MessageTypeOverride = Omit<MessageType, "image" | "sent_at"> & {
  image?: {
    base64: string;
    content_type: string;
  };
};
