import { HttpResponse, http } from "msw";
import type { DocumentationApiResponse } from "../lib/docs/types";
import type * as v2 from "../lib/portal/types";
import {
  mockApiError,
  mockBestPracticesDocumentation,
  mockChatSdkDocumentation,
  mockGeneralMigrationGuideDocumentation,
  mockHowToDocumentation,
  mockIlluminateActionLog,
  mockIlluminateBusinessObject,
  mockIlluminateQueryFields,
  mockIlluminateQueryResult,
  mockInsightsResult,
  mockInsightsTopResult,
  mockSdkDocumentation,
  mockSdkMigrationGuideDocumentation,
  mockV2App,
  mockV2AppsListResponse,
  mockV2CreateKeysetResponse,
  mockV2KeysetsListResponse,
} from "./test-fixtures";

const ADMIN_API_V2_URL = process.env.ADMIN_API_V2_URL ?? "https://admin-api.pubnub.com";
const SDK_DOCS_API_URL = process.env.SDK_DOCS_API_URL ?? "https://docs.pubnubtools.com/api/v1";

export const portalV2Handlers = [
  http.get(`${ADMIN_API_V2_URL}/v2/apps`, () => {
    return HttpResponse.json<v2.AppsResponse>(mockV2AppsListResponse);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/apps`, () => {
    return HttpResponse.json<v2.ApiApp>(mockV2App, { status: 201 });
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/apps/:id`, () => {
    return HttpResponse.json<v2.ApiApp>(mockV2App);
  }),

  http.patch(`${ADMIN_API_V2_URL}/v2/apps/:id`, () => {
    return HttpResponse.json<v2.ApiApp>(mockV2App);
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

  http.get(`${SDK_DOCS_API_URL}/migration-guide`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockSdkMigrationGuideDocumentation);
  }),

  http.get(`${SDK_DOCS_API_URL}/general-migration-guide`, () => {
    return HttpResponse.json<DocumentationApiResponse>(mockGeneralMigrationGuideDocumentation);
  }),
];

export const illuminateHandlers = [
  http.get(`${ADMIN_API_V2_URL}/v2/illuminate/queries/:id/fields`, () => {
    return HttpResponse.json(mockIlluminateQueryFields);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/illuminate/queries/execute`, () => {
    return HttpResponse.json(mockIlluminateQueryResult);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/illuminate/queries/:id/execute`, () => {
    return HttpResponse.json(mockIlluminateQueryResult);
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/illuminate/decisions/:id/action-log`, () => {
    return HttpResponse.json(mockIlluminateActionLog);
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/illuminate/:resource`, () => {
    return HttpResponse.json([mockIlluminateBusinessObject]);
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/illuminate/:resource/:id`, () => {
    return HttpResponse.json(mockIlluminateBusinessObject);
  }),

  http.post(`${ADMIN_API_V2_URL}/v2/illuminate/:resource`, () => {
    return HttpResponse.json(mockIlluminateBusinessObject, { status: 201 });
  }),

  http.put(`${ADMIN_API_V2_URL}/v2/illuminate/:resource/:id`, () => {
    return HttpResponse.json(mockIlluminateBusinessObject);
  }),

  http.delete(`${ADMIN_API_V2_URL}/v2/illuminate/:resource/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];

export const insightsHandlers = [
  http.get(`${ADMIN_API_V2_URL}/v2/insights/top`, () => {
    return HttpResponse.json(mockInsightsTopResult);
  }),

  http.get(`${ADMIN_API_V2_URL}/v2/insights`, () => {
    return HttpResponse.json(mockInsightsResult);
  }),
];

export const handlers = [
  ...portalV2Handlers,
  ...docsHandlers,
  ...illuminateHandlers,
  ...insightsHandlers,
];

export const errorHandlers = {
  adminApiError: (status = 500, message = "Internal Server Error") =>
    http.all(`${ADMIN_API_V2_URL}/*`, () => {
      return HttpResponse.json(mockApiError, { status, statusText: message });
    }),

  docsError: (status = 500, message = "Internal Server Error") =>
    http.all(`${SDK_DOCS_API_URL}/*`, () => {
      return HttpResponse.json(mockApiError, { status, statusText: message });
    }),
};
