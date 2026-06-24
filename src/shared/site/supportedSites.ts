import type { SiteContext } from "@/shared/types/siteContext";

export type SupportedSiteDefinition = {
  id: string;
  name: string;
  hostPatterns: string[];
  detectPatientId: (document: Document, location: Location) => string | null;
};

const placeholderHealthDataSite: SupportedSiteDefinition = {
  id: "health-data-site-placeholder",
  name: "Health data website",
  hostPatterns: [],
  detectPatientId: (_document, location) => {
    const params = new URLSearchParams(location.search);
    return params.get("patientId") ?? params.get("patient_id");
  },
};

export const supportedSites: SupportedSiteDefinition[] = [placeholderHealthDataSite];

function matchesHost(hostname: string, pattern: string) {
  if (pattern.startsWith("*.")) {
    return hostname.endsWith(pattern.slice(1));
  }

  return hostname === pattern;
}

export function detectSiteContext(document: Document, location: Location): SiteContext {
  const supportedSite = supportedSites.find((site) =>
    site.hostPatterns.some((pattern) => matchesHost(location.hostname, pattern)),
  );

  if (!supportedSite) {
    return {
      status: "unsupported",
      detectedAt: new Date().toISOString(),
    };
  }

  return {
    siteId: supportedSite.id,
    siteName: supportedSite.name,
    status: "supported",
    detectedPatientId: supportedSite.detectPatientId(document, location) ?? undefined,
    detectedAt: new Date().toISOString(),
  };
}
