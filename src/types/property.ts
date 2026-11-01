
export type PropertyType =
  | "Residential Apartment"
  | "Residential Plot"
  | "Independent House / Villa"
  | "Farm House";

export type PostedByType = "Owner" | "Dealer" | "Builder";

export interface Property {
  id: number | string;
  owner_id: number | string;
  title: string;
  description: string;
  city: string;
  address: string;
  price: number | string;
  property_type: PropertyType;
  posted_by: PostedByType;
  bedrooms: number;
  total_square_feet: number | string | null;
  length_feet: number | string | null;
  breadth_feet: number | string | null;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  city: string;
  address: string;
  price: number;
  property_type: PropertyType;
  posted_by?: PostedByType;
  bedrooms: number;
  total_square_feet?: number | null;
  length_feet?: number | null;
  breadth_feet?: number | null;
  images?: string[];
}

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export type PostedByFilter = "Owner" | "Dealer" | "Builder";

export interface PropertySearchFilters {
  city?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  posted_by?: PostedByFilter;
  page?: number;
  limits?: number;
  search?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  page: number;
  limit: number;
  total?: number;
}

export interface MyPropertiesResponse {
  properties: Property[];
}

export interface SinglePropertyResponse {
  property: Property;
}

export interface PropertyMutationResponse {
  message: string;
  property: Property;
}

export interface DeletePropertyResponse {
  message: string;
}

export interface PropertyApiError {
  error?: string;
  details?: unknown;
}
