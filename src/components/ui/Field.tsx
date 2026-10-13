import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

type FieldProps = BaseProps &
  (
    | ({ multiline?: false } & InputHTMLAttributes<HTMLInputElement>)
    | ({ multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>)
  );

const inputClasses =
  "w-full rounded-xl border bg-surface px-4 py-3 text-fg placeholder:text-muted/80 transition-colors focus:outline-none focus-visible:outline-2 focus-visible:outline-accent";

/** Campo di form: etichetta sopra, suggerimento ed errore sotto. */
export function Field(props: FieldProps) {
  const { id, label, error, hint, multiline, ...rest } = props;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const border = error ? "border-danger" : "border-line hover:border-fg/30";

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClasses} ${border} min-h-36 resize-y`}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`${inputClasses} ${border}`}
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
