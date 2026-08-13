import type React from "react";

const PageHeading = ({
  crumb,
  title,
  subtitle,
  action,
}: {
  crumb?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {crumb && <p className="text-sm text-slate-500">{crumb}</p>}
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.03em] text-foreground">
          {title}
        </h1>
        {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export default PageHeading;
