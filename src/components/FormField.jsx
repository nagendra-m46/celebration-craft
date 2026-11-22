/**
 * Wraps a label, its input (passed as children) and an inline error message.
 * Pair with fieldProps() so the input gets matching id, name and ARIA attributes.
 */
export default function FormField({ id, label, error, children }) {
  return (
    <div className={`form-field${error ? ' has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} className="error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Shared attributes for an input: id, name (used by onChange), and accessibility flags. */
export function fieldProps(id, error) {
  return {
    id,
    name: id,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
  };
}
