import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type ForgotPasswordFormValues = {
  email: string;
};

function ForgotPasswordApp() {
  const { register } = useForm<ForgotPasswordFormValues>();

  return (
    <PageShell eyebrow="Account help" title="Forgot Password" subtitle="This form is ready for backend-driven password recovery.">
      <form className="form-card">
        <label>
          Work email
          <input autoComplete="email" type="email" {...register("email")} />
        </label>
        <Button type="button">Send recovery link</Button>
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <ForgotPasswordApp />);
}
