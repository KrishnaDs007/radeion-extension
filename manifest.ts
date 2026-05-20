import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "Radeion Healthcare Companion",
  version: "0.1.0",
  description: "Secure healthcare companion extension frontend scaffold.",
  action: {
    default_popup: "src/ui/popup/index.html",
    default_title: "Radeion",
  },
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  options_page: "src/ui/options/index.html",
  permissions: ["activeTab", "storage"],
  host_permissions: [],
  content_scripts: [
    {
      matches: ["https://example-healthcare-app.invalid/*"],
      js: ["src/content/index.tsx"],
      run_at: "document_idle",
    },
  ],
  web_accessible_resources: [
    {
      resources: ["assets/*"],
      matches: ["https://example-healthcare-app.invalid/*"],
    },
  ],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';",
  },
};

export default manifest;
