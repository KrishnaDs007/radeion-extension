import type { ApiPaginatedResponse } from "@/shared/api/apiClient";
import { apiRequest } from "@/shared/api/apiClient";

export type PatientSearchParams = {
  patientId?: string;
  name?: string;
  limit?: number;
  offset?: number;
};

export type PatientDataRow = Record<string, unknown>;

function toQuery(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function searchPatientMetrics(params: PatientSearchParams) {
  return apiRequest<ApiPaginatedResponse<PatientDataRow>>({
    path: `/patient-metrics${toQuery({
      patientId: params.patientId,
      name: params.name,
      limit: params.limit ?? 25,
      offset: params.offset ?? 0,
    })}`,
  });
}

export async function getPatientClaims(patientId: string) {
  return apiRequest<ApiPaginatedResponse<PatientDataRow>>({
    path: `/claims${toQuery({ patientId, limit: 25, offset: 0 })}`,
  });
}
