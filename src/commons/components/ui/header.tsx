"use client";

import { cn } from "@/commons/libs/cn";
import { Slash } from "lucide-react";
import * as React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

function arePropsEqual(prev: HeaderProps, next: HeaderProps) {
  return (
    prev.title === next.title &&
    prev.description === next.description &&
    prev.icon === next.icon &&
    prev.actions === next.actions &&
    prev.badge === next.badge &&
    prev.className === next.className &&
    JSON.stringify(prev.breadcrumbs) === JSON.stringify(next.breadcrumbs)
  );
}

const Header = React.memo(
  React.forwardRef<HTMLDivElement, HeaderProps>(
    (
      {
        title,
        description,
        breadcrumbs,
        actions,
        icon,
        badge,
        className,
        ...props
      },
      ref
    ) => {
      return (
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-6 w-full",
            "pb-6 border-b border-white/5",
            "mb-6",
            className
          )}
          {...props}
        >
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-500">
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  return (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <Slash className="mx-2 h-3 w-3 opacity-30 -rotate-12" />
                      )}
                      {crumb.href && !isLast ? (
                        <a
                          href={crumb.href}
                          className="hover:text-white transition-colors duration-200"
                        >
                          {crumb.label}
                        </a>
                      ) : (
                        <span
                          className={cn(
                            "font-medium",
                            isLast ? "text-indigo-400" : "text-slate-500"
                          )}
                        >
                          {crumb.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          )}

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex items-center gap-5 min-w-0">
              {icon && (
                <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white shadow-sm">
                  {React.cloneElement(
                    icon as React.ReactElement<{ className?: string }>,
                    { className: "h-6 w-6" }
                  )}
                </div>
              )}

              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-bold tracking-tight text-white truncate">
                    {title}
                  </h3>
                  {badge && (
                    <div className="shrink-0 animate-in fade-in zoom-in duration-300">
                      {badge}
                    </div>
                  )}
                </div>

                {description && (
                  <div className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                    {description}
                  </div>
                )}
              </div>
            </div>

            {actions && (
              <div className="flex items-center gap-3 shrink-0 flex-wrap md:flex-nowrap mt-1">
                {actions}
              </div>
            )}
          </div>
        </div>
      );
    }
  ),
  arePropsEqual
);

Header.displayName = "Header";

export { Header };
