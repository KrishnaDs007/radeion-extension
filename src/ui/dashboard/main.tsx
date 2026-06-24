import { Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { ApiError } from "@/shared/api/apiClient";
import { useAuthSession } from "@/shared/auth/useAuthSession";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";
import { StatusPill } from "@/shared/components/StatusPill";
import { searchPatientMetrics } from "@/shared/patient/patientApi";
import type { PatientDataRow } from "@/shared/patient/patientApi";
import { savePatientBasicMetadata } from "@/shared/patient/patientMetadataStorage";
import type { PatientTabId } from "@/shared/patient/patientTabs";
import { patientTabs } from "@/shared/patient/patientTabs";

type PatientSearchFormValues = {
  patientId: string;
  name: string;
};

function getDisplayValue(row: PatientDataRow, keys: string[]) {
  const match = keys.map((key) => row[key]).find((value) => value !== undefined && value !== null);
  return match === undefined ? "" : String(match);
}

function DashboardApp() {
  const { isConfigured, isLoading, user } = useAuthSession();
  const { handleSubmit, register } = useForm<PatientSearchFormValues>();
  const [selectedTab, setSelectedTab] = useState<PatientTabId>("home");
  const [statusMessage, setStatusMessage] = useState("");
  const [patientRows, setPatientRows] = useState<PatientDataRow[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  async function onSearch(values: PatientSearchFormValues) {
    setIsSearching(true);
    setStatusMessage("");

    try {
      const response = await searchPatientMetrics({
        patientId: values.patientId,
        name: values.name,
      });

      setPatientRows(response.data);

      const firstPatient = response.data[0];
      const patientId = firstPatient
        ? getDisplayValue(firstPatient, ["patientId", "patient_id", "patientID"])
        : "";

      if (patientId) {
        await savePatientBasicMetadata({
          patientId,
          detailId: getDisplayValue(firstPatient, ["detailId", "detail_id"]) || undefined,
          name: getDisplayValue(firstPatient, ["name", "patientName", "patient_name"]) || undefined,
          updatedById: getDisplayValue(firstPatient, ["updatedById", "updated_by_id"]) || undefined,
          updatedAt: new Date().toISOString(),
        });
      }

      setStatusMessage(response.data.length ? "Patient data loaded." : "No patient data found.");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setStatusMessage("Your session expired. Please sign in again.");
      } else if (error instanceof ApiError && error.status === 403) {
        setStatusMessage("You do not have access to this patient data.");
      } else {
        setStatusMessage("Unable to load patient data. Try again or contact support.");
      }
    } finally {
      setIsSearching(false);
    }
  }

  if (isLoading) {
    return (
      <PageShell eyebrow="Radeion Dashboard" title="Loading" subtitle="Checking your session." />
    );
  }

  if (!isConfigured || !user) {
    return (
      <PageShell
        eyebrow="Radeion Dashboard"
        title="Login Required"
        subtitle="Sign in with an approved account to access patient workflows."
      >
        <div className="form-card">
          <Button onClick={() => (window.location.href = "../login/index.html")}>Go to login</Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Radeion Dashboard"
      title="Healthcare Companion"
      subtitle="Search for patient records and open dynamic patient workflow tabs."
    >
      <div className="dashboard-layout">
        <aside className="sidebar">
          {patientTabs.map(({ id, icon: Icon, label }) => (
            <button
              className={`sidebar-item ${selectedTab === id ? "sidebar-item-active" : ""}`.trim()}
              key={id}
              onClick={() => setSelectedTab(id)}
              type="button"
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </aside>
        <section className="workspace">
          <div className="workspace-header">
            <h2>{patientTabs.find((tab) => tab.id === selectedTab)?.label}</h2>
            <StatusPill label="Backend ready" tone="success" />
          </div>

          {selectedTab === "home" ? (
            <form className="search-panel" onSubmit={handleSubmit(onSearch)}>
              <label>
                Patient ID
                <input type="search" {...register("patientId")} />
              </label>
              <label>
                Patient name
                <input type="search" {...register("name")} />
              </label>
              <Button disabled={isSearching} type="submit">
                <Search size={16} />
                {isSearching ? "Searching..." : "Search"}
              </Button>
              {statusMessage ? <p className="form-message">{statusMessage}</p> : null}
            </form>
          ) : null}

          {selectedTab !== "home" ? (
            <div className="empty-state">
              <h3>{selectedTab === "patientDetails" ? "Patient Details" : "Vitals"}</h3>
              <p>
                This view will use existing backend data first. Field-level layout can stay dynamic
                until managers confirm the final data set.
              </p>
            </div>
          ) : null}

          {patientRows.length ? (
            <div className="result-list">
              {patientRows.slice(0, 5).map((row, index) => (
                <article className="result-item" key={`${getDisplayValue(row, ["patientId", "patient_id"])}-${index}`}>
                  <strong>
                    {getDisplayValue(row, ["name", "patientName", "patient_name"]) || "Patient record"}
                  </strong>
                  <span>{getDisplayValue(row, ["patientId", "patient_id", "patientID"]) || "No patient ID"}</span>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <DashboardApp />);
}
