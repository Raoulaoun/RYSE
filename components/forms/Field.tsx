import type { HTMLAttributes, ReactNode } from "react";

export type Errors = Record<string, string>;

type FieldProps = HTMLAttributes<HTMLDivElement> & {
  name: string;
  errors: Errors;
  children: ReactNode;
};

// A .field wrapper that shows the design's inline error state for `name`.
export function Field({ name, errors, className, children, ...rest }: FieldProps) {
  const msg = errors[name];
  return (
    <div className={["field", className, msg ? "err" : ""].filter(Boolean).join(" ")} data-field={name} {...rest}>
      {children}
      {msg && <span className="errmsg">{msg}</span>}
    </div>
  );
}

export function Req() {
  return <span className="req">*</span>;
}

export function Counter({ value, max }: { value: string; max: number }) {
  return (
    <span className="counter">
      {value.length} / {max}
    </span>
  );
}

// Moves focus to the first invalid field and scrolls it into view.
export function focusField(name: string) {
  const field = document.querySelector<HTMLElement>(`[data-field="${CSS.escape(name)}"]`);
  if (!field) return;
  field.querySelector<HTMLElement>("input,select,textarea")?.focus({ preventScroll: true });
  field.scrollIntoView({ behavior: "smooth", block: "center" });
}

export function without(errors: Errors, ...names: string[]) {
  if (!names.some((n) => n in errors)) return errors;
  const next = { ...errors };
  for (const n of names) delete next[n];
  return next;
}
