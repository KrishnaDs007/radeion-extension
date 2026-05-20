export type UserRole = "admin" | "clinician" | "careCoordinator" | "support" | "readOnly";

export type AuthenticatedUser = {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  organizationName: string;
};

export type AuthSessionStatus = "unknown" | "signedOut" | "signedIn";
