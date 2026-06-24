import { useState } from "react";
import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { supabase } from "@/shared/auth/supabaseClient";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type ResetPasswordFormValues = {
  password: string;
};

function ResetPasswordApp() {
  const { handleSubmit, register } = useForm<ResetPasswordFormValues>();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!supabase) {
      setStatusMessage("Password reset is not configured for this environment.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: values.password });
    setIsSubmitting(false);
    setStatusMessage(error ? error.message : "Password updated. You can return to login.");
  }

  return (
    <PageShell
      eyebrow="Account help"
      title="Reset Password"
      subtitle="Set a new password after opening the recovery link."
    >
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <label>
          New password
          <input autoComplete="new-password" type="password" {...register("password")} />
        </label>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Updating..." : "Update password"}
        </Button>
        {statusMessage ? <p className="form-message">{statusMessage}</p> : null}
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <ResetPasswordApp />);
}
