import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type LoginFormValues = {
  email: string;
  password: string;
};

function LoginApp() {
  const { register } = useForm<LoginFormValues>();

  return (
    <PageShell eyebrow="Secure access" title="Login" subtitle="Authentication wiring will be added with the backend setup.">
      <form className="form-card">
        <label>
          Email
          <input autoComplete="email" type="email" {...register("email")} />
        </label>
        <label>
          Password
          <input autoComplete="current-password" type="password" {...register("password")} />
        </label>
        <Button type="button">Continue</Button>
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <LoginApp />);
}
