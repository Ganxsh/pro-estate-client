
import { apiRequest } from "./client";

import type {
  CreatePropertyPayload,
  DeletePropertyResponse,
  MyPropertiesResponse,
  PropertyListResponse,
  PropertyMutationResponse,
  PropertySearchFilters,
  SinglePropertyResponse,
  UpdatePropertyPayload,
} from "@/types/property";

const BASE_PATH = "/properties";

export interface PlatformStats {
  total_properties: number;
  total_users: number;
  total_builders_dealers: number;
}

export const statsApi = {
  getPlatformStats(): Promise<PlatformStats> {
    return apiRequest<PlatformStats>(`${BASE_PATH}/stats`, { method: "GET" });
  },
};

export interface InquiryResponse {
  message: string;
  inquiry: { id: number; property_id: number; sender_id: number; message: string; created_at: string };
}

export const inquiryApi = {
  create(payload: { property_id: number; message: string; phone?: string }): Promise<InquiryResponse> {
    return apiRequest<InquiryResponse>("/inquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

export const propertyApi = {
  // Create a property listing (authentication required)
  create(
    payload: CreatePropertyPayload
  ): Promise<PropertyMutationResponse> {
    return apiRequest<PropertyMutationResponse>(BASE_PATH, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Browse and search public property listings
  getAll(
    filters: PropertySearchFilters = {}
  ): Promise<PropertyListResponse> {
    const params = new URLSearchParams();

    if (filters.city) {
      params.set("city", filters.city);
    }

    if (filters.property_type) {
      params.set("property_type", filters.property_type);
    }

    if (filters.min_price !== undefined) {
      params.set("min_price", String(filters.min_price));
    }

    if (filters.max_price !== undefined) {
      params.set("max_price", String(filters.max_price));
    }

    if (filters.bedrooms !== undefined) {
      params.set("bedrooms", String(filters.bedrooms));
    }

    if (filters.posted_by) {
      params.set("posted_by", filters.posted_by);
    }

    if (filters.page !== undefined) {
      params.set("page", String(filters.page));
    }

    if (filters.limits !== undefined) {
      params.set("limits", String(filters.limits));
    }

    if (filters.search) {
      params.set("search", filters.search);
    }

    const query = params.toString();
    const endpoint = query
      ? `${BASE_PATH}?${query}`
      : BASE_PATH;

    return apiRequest<PropertyListResponse>(endpoint, {
      method: "GET",
    });
  },

  // Get listings belonging to the authenticated user
  getMine(): Promise<MyPropertiesResponse> {
    return apiRequest<MyPropertiesResponse>(
      `${BASE_PATH}/me/properties`,
      {
        method: "GET",
      }
    );
  },

  // Get one property by ID
  getById(id: number | string): Promise<SinglePropertyResponse> {
    return apiRequest<SinglePropertyResponse>(
      `${BASE_PATH}/${encodeURIComponent(String(id))}`,
      {
        method: "GET",
      }
    );
  },

  // Update a property owned by the authenticated user
  update(
    id: number | string,
    payload: UpdatePropertyPayload
  ): Promise<PropertyMutationResponse> {
    return apiRequest<PropertyMutationResponse>(
      `${BASE_PATH}/${encodeURIComponent(String(id))}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      }
    );
  },

  // Delete a property owned by the authenticated user
  delete(
    id: number | string
  ): Promise<DeletePropertyResponse> {
    return apiRequest<DeletePropertyResponse>(
      `${BASE_PATH}/${encodeURIComponent(String(id))}`,
      {
        method: "DELETE",
      }
    );
  },
};
