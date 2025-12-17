import { HttpResponse, http } from "msw";

import { server } from "./msw-setup";

type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

const methodMap: Record<HttpMethod, typeof http.get> = {
  get: http.get,
  post: http.post,
  put: http.put,
  patch: http.patch,
  delete: http.delete,
};

function buildUrl(baseUrl: string | undefined, fallback: string, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl ?? fallback}${normalizedPath}`;
}

function resolvePortalUrl(path: string) {
  const baseUrl = process.env.ADMIN_API_V1_URL ?? "https://admin.pubnub.com/api";
  return buildUrl(baseUrl, "https://admin.pubnub.com/api", path);
}

function resolveAdminApiUrl(path: string) {
  const baseUrl = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
  return buildUrl(baseUrl, "https://admin-api.pubnub.com", path);
}

function resolveDocsUrl(path: string) {
  const baseUrl = process.env.SDK_DOCS_API_URL ?? "https://docs.pubnubtools.com/api/v1";
  return buildUrl(baseUrl, "https://docs.pubnubtools.com/api/v1", path);
}

// v1 Portal API overrides
export function overridePortalRoute(
  method: HttpMethod,
  path: string,
  resolver: Parameters<typeof http.get>[1]
) {
  server.use(methodMap[method](resolvePortalUrl(path), resolver));
}

export function overridePortalResponse(
  method: HttpMethod,
  path: string,
  body: Parameters<typeof HttpResponse.json>[0],
  init?: Parameters<typeof HttpResponse.json>[1]
) {
  overridePortalRoute(method, path, () => HttpResponse.json(body, init));
}

// v2 Admin API overrides
export function overrideAdminApiRoute(
  method: HttpMethod,
  path: string,
  resolver: Parameters<typeof http.get>[1]
) {
  server.use(methodMap[method](resolveAdminApiUrl(path), resolver));
}

export function overrideAdminApiResponse(
  method: HttpMethod,
  path: string,
  body: Parameters<typeof HttpResponse.json>[0],
  init?: Parameters<typeof HttpResponse.json>[1]
) {
  overrideAdminApiRoute(method, path, () => HttpResponse.json(body, init));
}

// Documentation API overrides
export function overrideDocsRoute(
  method: HttpMethod,
  path: string,
  resolver: Parameters<typeof http.get>[1]
) {
  server.use(methodMap[method](resolveDocsUrl(path), resolver));
}

export function overrideDocsResponse(
  method: HttpMethod,
  path: string,
  body: Parameters<typeof HttpResponse.json>[0],
  init?: Parameters<typeof HttpResponse.json>[1]
) {
  overrideDocsRoute(method, path, () => HttpResponse.json(body, init));
}
