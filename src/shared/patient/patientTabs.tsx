import { Activity, Home, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type PatientTabId = "home" | "patientDetails" | "vitals";

export type PatientTabDefinition = {
  id: PatientTabId;
  label: string;
  icon: LucideIcon;
};

export const patientTabs: PatientTabDefinition[] = [
  {
    id: "home",
    label: "Home",
    icon: Home,
  },
  {
    id: "patientDetails",
    label: "Patient Details",
    icon: UserRound,
  },
  {
    id: "vitals",
    label: "Vitals",
    icon: Activity,
  },
];
