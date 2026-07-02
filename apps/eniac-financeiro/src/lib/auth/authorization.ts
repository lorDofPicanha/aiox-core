export const COMPANY_ROLES = ["admin", "operator", "viewer"] as const;

export type CompanyRole = (typeof COMPANY_ROLES)[number];
export type CompanyCapability = "read" | "write" | "manage_members";

const CAPABILITIES: Record<CompanyRole, readonly CompanyCapability[]> = {
  admin: ["read", "write", "manage_members"],
  operator: ["read", "write"],
  viewer: ["read"],
};

export function hasCompanyCapability(
  role: CompanyRole,
  capability: CompanyCapability,
): boolean {
  return CAPABILITIES[role].includes(capability);
}
