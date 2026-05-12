import { HttpResponse, http } from "msw";
import type { DocumentationApiResponse } from "../lib/docs/types";
import type * as v1 from "../lib/portal/v1/types";
import type * as v2 from "../lib/portal/v2/types";
import {
  mockApiError,
  mockAppsListResponse,
  mockAuthError,
  mockAuthResponse,
  mockBestPracticesDocumentation,
  mockChatSdkDocumentation,
  mockCreateAppResponse,
  mockCreateKeyResponse,
  mockFaasNoConflictsResponse,
  mockHowToDocumentation,
  mockListKeysResponse,
  mockSdkDocumentation,
  mockV2App,
  mockV2AppsListResponse,
  mockV2CreateKeysetResponse,
  mockV2KeysetsListResponse,
} from "./test-fixtures";

const ADMIN_API_V1_URL = process.env.ADMIN_API_V1_URL ?? "https://admin.pubnub.com/api";
const ADMIN_API_V2_URL = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
const SDK_DOCS_API_URL = process.env.SDK_DOCS_API_URL ?? "https://docs.pubnubtools.com/api/v1";

// v1 Portal API Handlers
export const portalV1Handlers = [
  http.post(`${ADMIN_API_V1_URL}/me`, () => {
    return HttpResponse.json<v1.AuthResponse>(mockAuthResponse);
  }),

  http.get(`${ADMIN_API_V1_URL}/apps`, () => {
    return HttpResponse.json<v1.AppsResponse>(mockAppsListResponse);
  }),

  http.post(`${ADMIN_API_V1_URL}/apps`, () => {
    return HttpResponse.json<v1.AppResponse>(mockCreateAppResponse);
  }),

  http.put(`${ADMIN_API_V1_URL}/apps/:id`, () => {
    return HttpResponse.json<v1.AppResponse>(mockCreateAppResponse);
  }),

  http.get(`${ADMIN_API_V1_URL}/keys`, () => {
    return HttpResponse.json<v1.KeysetsResponse>(mockListKeysResponse);
  }),

  http.post(`${ADMIN_API_V1_URL}/keys`, () => {
    return HttpResponse.json<v1.KeysetResponse>(mockCreateKeyResponse);
  }),

  http.put(`${ADMIN_API_V1_URL}/keys/:id`, () => {
    return HttpResponse.json<v1.KeysetResponse>(mockCreateKeyResponse);
  }),

  http.post(`${ADMIN_API_V1_URL}/bizops-dashboards/accounts/:accountId/word-lists`, () => {
    return HttpResponse.json<v1.CreateWordListRequest>();
  }),

  http.get(`${ADMIN_API_V1_URL}/faas/v1/package-deployments/intersected`, () => {
    return HttpResponse.json<v1.FaasConflictsResponse>(mockFaasNoConflictsResponse);
  }),

  http.post(`${ADMIN_API_V1_URL}/bizops-dashboards/auto-moderation/:accountId/configs`, () => {
    return HttpResponse.json({});
  }),
];

// v2 Admin API Handlers
export const portalV2Handlers = [
  http.get(`${ADMIN_API_V2_URL}/v2/apps`, () => {
    return HttpResponse.json<v2.AppsResponse>(mockV2AppsListResponse);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/apps`, () => {
    return HttpResponse.json<v2.App>(mockV2App, { status: 201 });
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/apps/:id`, () => {
    return HttpResponse.json<v2.App>(mockV2App);
  }),

  http.patch(`${ADMIN_API_V2_URL}/v2/apps/:id`, () => {
    return HttpResponse.json<v2.App>(mockV2App);
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/keysets`, () => {
    return HttpResponse.json<v2.KeysetsResponse>(mockV2KeysetsListResponse);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/keysets`, () => {
    return HttpResponse.json<v2.CreateKeysetResponse>(mockV2CreateKeysetResponse, { status: 201 });
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/keysets/:id/config`, () => {
    return HttpResponse.json<v2.KeysetConfigResponse>(mockV2CreateKeysetResponse.config);
  }),

  http.patch(`${ADMIN_API_V2_URL}/v2/keysets/:id/config`, () => {
    return HttpResponse.json<v2.KeysetConfigResponse>(mockV2CreateKeysetResponse.config);
  }),
];

export const docsHandlers = [
  http.get(`${SDK_DOCS_API_URL}/sdk`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockSdkDocumentation);
  }),

  http.get(`${SDK_DOCS_API_URL}/chat-sdk`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockChatSdkDocumentation);
  }),

  http.get(`${SDK_DOCS_API_URL}/how-to`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockHowToDocumentation);
  }),

  http.get(`${SDK_DOCS_API_URL}/best-practice`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockBestPracticesDocumentation);
  }),
];

export const handlers = [...portalV1Handlers, ...portalV2Handlers, ...docsHandlers];

export const errorHandlers = {
  authError: () =>
    http.post(`${ADMIN_API_V1_URL}/me`, () => {
      return HttpResponse.json(mockAuthError, { status: 401 });
    }),

  portalError: (status = 500, message = "Internal Server Error") =>
    http.all(`${ADMIN_API_V1_URL}/*`, () => {
      return HttpResponse.json(mockApiError, { status, statusText: message });
    }),

  adminApiError: (status = 500, message = "Internal Server Error") =>
    http.all(`${ADMIN_API_V2_URL}/*`, () => {
      return HttpResponse.json(mockApiError, { status, statusText: message });
    }),

  docsError: (status = 500, message = "Internal Server Error") =>
    http.all(`${SDK_DOCS_API_URL}/*`, () => {
      return HttpResponse.json(mockApiError, { status, statusText: message });
    }),
};
