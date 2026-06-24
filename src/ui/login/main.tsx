import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { getAuthMethods } from "@/shared/api/apiClient";
import { supabase } from "@/shared/auth/supabaseClient";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginApp() {
  const { handleSubmit, register } = useForm<LoginFormValues>();
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAuthMethods()
      .then((methods) => {
        if (!methods.methods.includes("emailPassword")) {
          setStatusMessage("Email/password login is not enabled for this environment.");
        }
      })
      .catch(() => {
        setStatusMessage("Unable to verify login methods. You can still try signing in.");
      });
  }, []);

  async function onSubmit(values: LoginFormValues) {
    if (!supabase) {
      setStatusMessage("Login is not configured for this environment.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(values);
    setIsSubmitting(false);

    if (error) {
      setStatusMessage(error.message);
      return;
    }

    window.location.href = "../dashboard/index.html";
  }

  return (
    <PageShell
      eyebrow="Secure access"
      title="Login"
      subtitle="Use your approved Radeion account to access patient workflows."
    >
      <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
        <label>
          Email
          <input autoComplete="email" type="email" {...register("email")} />
        </label>
        <label>
          Password
          <input autoComplete="current-password" type="password" {...register("password")} />
        </label>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Continue"}
        </Button>
        <a className="text-link" href="../forgot-password/index.html">
          Forgot password?
        </a>
        {statusMessage ? <p className="form-message">{statusMessage}</p> : null}
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <LoginApp />);
}
