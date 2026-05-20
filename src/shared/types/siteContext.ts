export type SupportedSiteStatus = "unknown" | "supported" | "unsupported";

export type SiteContext = {
  siteId?: string;
  siteName?: string;
  status: SupportedSiteStatus;
  detectedPatientId?: string;
  pageCategory?: string;
  detectedAt?: string;
};
