import { describe, expect, it } from "vitest";
import { normalizeClientIp } from "./http";

describe("normalizeClientIp", () => {
  it("strips the ::ffff: IPv4-mapped IPv6 prefix", () => {
    expect(normalizeClientIp("::ffff:172.24.15.65")).toBe("172.24.15.65");
  });

  it("leaves a plain IPv4 address unchanged", () => {
    expect(normalizeClientIp("203.0.113.7")).toBe("203.0.113.7");
  });

  it("leaves a genuine IPv6 address unchanged", () => {
    expect(normalizeClientIp("2001:db8::1")).toBe("2001:db8::1");
  });

  it("returns undefined when no ip is present", () => {
    expect(normalizeClientIp(undefined)).toBeUndefined();
  });
});
