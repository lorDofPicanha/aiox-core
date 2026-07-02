import { describe, expect, it } from "vitest";
import { hasCompanyCapability, type CompanyRole } from "@/lib/auth/authorization";

describe("hasCompanyCapability", () => {
  const matrix: Array<[CompanyRole, boolean, boolean, boolean]> = [
    ["admin", true, true, true],
    ["operator", true, true, false],
    ["viewer", true, false, false],
  ];

  it.each(matrix)("maps %s to the expected capabilities", (role, read, write, manage) => {
    expect(hasCompanyCapability(role, "read")).toBe(read);
    expect(hasCompanyCapability(role, "write")).toBe(write);
    expect(hasCompanyCapability(role, "manage_members")).toBe(manage);
  });
});
