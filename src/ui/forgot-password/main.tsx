import { useState } from "react";
import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { requestPasswordRecovery } from "@/shared/api/apiClient";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type ForgotPasswordFormValues = {
  email: string;
};

function ForgotPasswordApp() {
  const { handleSubmit, register } = useForm<ForgotPasswordFormValues>();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsSubmitting(true);

    try {
      const response = await requestPasswordRecovery(values.email);
      setStatusMessage(response.message);
    } catch {
      setStatusMessage("Unable to request password recovery. Try again or contact support.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell
      eyebrow="Account help"
      title="Forgot Password"
      subtitle="Request a recovery link for your approved Radeion account."
    >
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Work email
          <input autoComplete="email" type="email" {...register("email")} />
        </label>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Sending..." : "Send recovery link"}
        </Button>
        {statusMessage ? <p className="form-message">{statusMessage}</p> : null}
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <ForgotPasswordApp />);
}
