import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw-setup";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
