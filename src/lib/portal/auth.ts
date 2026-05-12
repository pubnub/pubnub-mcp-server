export type ApiVersion = "v1" | "v2";

export function hasV2Auth(): boolean {
  return !!process.env.PUBNUB_API_KEY;
}

export function hasV1Auth(): boolean {
  return !!(process.env.PUBNUB_EMAIL && process.env.PUBNUB_PASSWORD);
}

export function getApiVersion(): ApiVersion {
  if (hasV2Auth()) {
    return "v2";
  }

  if (hasV1Auth()) {
    return "v1";
  }

  throw new Error(
    "Portal API authentication not configured. Set PUBNUB_API_KEY for v2 API, or PUBNUB_EMAIL and PUBNUB_PASSWORD for v1 API."
  );
}

export function getApiKey(): string {
  const apiKey = process.env.PUBNUB_API_KEY;
  if (!apiKey) {
    throw new Error("PUBNUB_API_KEY environment variable must be set for v2 API");
  }
  return apiKey;
}

export function getV1Credentials(): { email: string; password: string } {
  const email = process.env.PUBNUB_EMAIL;
  const password = process.env.PUBNUB_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "PUBNUB_EMAIL and PUBNUB_PASSWORD environment variables must be set for v1 API"
    );
  }

  return { email, password };
}
