import type { PropsWithChildren } from "react";

type PageShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}>;

export function PageShell({ children, eyebrow, title, subtitle }: PageShellProps) {
  return (
    <main className="page-shell">
      <header className="page-header">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {subtitle ? <p className="subtitle">{subtitle}</p> : null}
      </header>
      {children}
    </main>
  );
}
