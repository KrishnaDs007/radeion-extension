export type PatientBasicMetadata = {
  patientId: string;
  detailId?: string;
  updatedById?: string;
  name?: string;
  updatedAt?: string;
};

const storageKey = "radeion:lastPatientBasicMetadata";

function isChromeStorageAvailable() {
  return typeof chrome !== "undefined" && Boolean(chrome.storage?.local);
}

export async function savePatientBasicMetadata(metadata: PatientBasicMetadata) {
  if (isChromeStorageAvailable()) {
    await chrome.storage.local.set({ [storageKey]: metadata });
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(metadata));
}

export async function getPatientBasicMetadata(): Promise<PatientBasicMetadata | null> {
  if (isChromeStorageAvailable()) {
    const result = await chrome.storage.local.get(storageKey);
    return (result[storageKey] as PatientBasicMetadata | undefined) ?? null;
  }

  const rawValue = window.localStorage.getItem(storageKey);
  return rawValue ? (JSON.parse(rawValue) as PatientBasicMetadata) : null;
}

export async function clearPatientBasicMetadata() {
  if (isChromeStorageAvailable()) {
    await chrome.storage.local.remove(storageKey);
    return;
  }

  window.localStorage.removeItem(storageKey);
}
