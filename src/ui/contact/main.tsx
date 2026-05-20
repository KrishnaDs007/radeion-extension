import { useForm } from "react-hook-form";

import { renderApp } from "@/app/renderApp";
import { Button } from "@/shared/components/Button";
import { PageShell } from "@/shared/components/PageShell";

type ContactFormValues = {
  subject: string;
  message: string;
};

function ContactApp() {
  const { register } = useForm<ContactFormValues>();

  return (
    <PageShell eyebrow="Support" title="Contact Help" subtitle="Support requests will be submitted through the backend when available.">
      <form className="form-card">
        <label>
          Subject
          <input type="text" {...register("subject")} />
        </label>
        <label>
          Message
          <textarea rows={5} {...register("message")} />
        </label>
        <Button type="button">Submit request</Button>
      </form>
    </PageShell>
  );
}

const root = document.getElementById("root");

if (root) {
  renderApp(root, <ContactApp />);
}
