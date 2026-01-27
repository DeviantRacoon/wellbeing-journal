// Tipos
interface ApiServiceProps {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  endpoint: string;
  data?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
  params?: Record<string, any>;
}

interface BackendResponse<T = any> {
  ok: boolean;
  data?: T;
  message: string;
  total?: number;
}

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
};

function buildURL(endpoint: string, params?: Record<string, any>): string {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(cleanEndpoint, API_CONFIG.baseURL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}

function prepareBody(data: any, isFormData: boolean): any {
  if (!data) return undefined;

  if (isFormData) {
    if (data instanceof FormData) return data;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });
    return formData;
  }

  return JSON.stringify(data);
}

export async function apiService<T = any>({
  method,
  endpoint,
  data,
  headers = {},
  isFormData = false,
  params,
}: ApiServiceProps): Promise<BackendResponse<T>> {
  const url = buildURL(endpoint, params);

  const requestHeaders: Record<string, string> = { ...headers };
  if (!isFormData && data && method !== "GET") {
    requestHeaders["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
    body: method !== "GET" ? prepareBody(data, isFormData) : undefined,
  };

  const response = await fetch(url, fetchOptions);
  return await response.json();
}

function createHttpMethod<T = any>(method: ApiServiceProps["method"]) {
  return (
    endpoint: string,
    dataOrParams?: any,
    options?: Partial<ApiServiceProps>,
  ) => {
    const isGetOrDelete = method === "GET" || method === "DELETE";
    return apiService<T>({
      method,
      endpoint,
      ...(isGetOrDelete ? { params: dataOrParams } : { data: dataOrParams }),
      ...options,
    });
  };
}

export const api = {
  get: createHttpMethod("GET"),
  post: createHttpMethod("POST"),
  put: createHttpMethod("PUT"),
  delete: createHttpMethod("DELETE"),
  patch: createHttpMethod("PATCH"),
};

export type { ApiServiceProps, BackendResponse };
