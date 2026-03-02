import React, { memo, useCallback, useMemo, useState } from 'react';
import './ContactSection.css';

const INITIAL_VALUES = Object.freeze({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const FIELDS = Object.freeze([
  { id: 'contact-name', name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { id: 'contact-email', name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { id: 'contact-subject', name: 'subject', label: 'Subject', type: 'text', autoComplete: 'off' },
  { id: 'contact-message', name: 'message', label: 'Message', type: 'textarea', autoComplete: 'off' },
]);

const EMPTY_ERRORS = Object.freeze({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const validate = (field, rawValue) => {
  const value = rawValue.trim();

  switch (field) {
    case 'name':
      if (!value) return 'Name is required.';
      if (value.length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'email':
      if (!value) return 'Email is required.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ''
        : 'Please enter a valid email address.';
    case 'subject':
      if (!value) return 'Subject is required.';
      if (value.length < 3) return 'Subject must be at least 3 characters.';
      return '';
    case 'message':
      if (!value) return 'Message is required.';
      if (value.length < 10) return 'Message must be at least 10 characters.';
      return '';
    default:
      return '';
  }
};

const Field = memo(function Field({
  id,
  name,
  label,
  type,
  value,
  error,
  touched,
  onChange,
  onBlur,
  autoComplete,
}) {
  const showError = touched && Boolean(error);
  const describedBy = showError ? `${id}-error` : undefined;
  const commonProps = {
    id,
    name,
    value,
    required: true,
    autoComplete,
    'aria-required': true,
    'aria-invalid': showError,
    'aria-describedby': describedBy,
    onChange,
    onBlur,
  };

  return (
    <div className="contact-field">
      <label className="contact-label" htmlFor={id}>
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          {...commonProps}
          className={`contact-textarea${showError ? ' is-error' : ''}`}
          rows={6}
        />
      ) : (
        <input
          {...commonProps}
          className={`contact-input${showError ? ' is-error' : ''}`}
          type={type}
        />
      )}

      <p
        id={`${id}-error`}
        className="contact-error"
        role="alert"
        aria-live="polite"
        hidden={!showError}
      >
        {error}
      </p>
    </div>
  );
});

function ContactSection() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('');

  const isFormValid = useMemo(() => Object.values(errors).every((item) => !item), [errors]);

  const updateFieldError = useCallback((name, value) => {
    const nextError = validate(name, value);
    setErrors((prev) => (prev[name] === nextError ? prev : { ...prev, [name]: nextError }));
    return nextError;
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setValues((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
      if (touched[name]) {
        updateFieldError(name, value);
      }
    },
    [touched, updateFieldError]
  );

  const handleBlur = useCallback(
    (event) => {
      const { name, value } = event.target;
      setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
      updateFieldError(name, value);
    },
    [updateFieldError]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setStatus('');

      const nextTouched = FIELDS.reduce((acc, field) => {
        acc[field.name] = true;
        return acc;
      }, {});

      const nextErrors = FIELDS.reduce((acc, field) => {
        acc[field.name] = validate(field.name, values[field.name]);
        return acc;
      }, {});

      setTouched(nextTouched);
      setErrors(nextErrors);

      if (Object.values(nextErrors).some(Boolean)) return;

      setIsSubmitting(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setValues(INITIAL_VALUES);
        setTouched({});
        setErrors(EMPTY_ERRORS);
        setStatus('Message sent successfully.');
      } catch {
        setStatus('Unable to send message right now. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [values]
  );

  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <div className="contact-container">
        <h2 id="contact-title" className="contact-title">
          Contact
        </h2>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          {FIELDS.map((field) => (
            <Field
              key={field.name}
              id={field.id}
              name={field.name}
              label={field.label}
              type={field.type}
              autoComplete={field.autoComplete}
              value={values[field.name]}
              error={errors[field.name]}
              touched={Boolean(touched[field.name])}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          ))}

          <button
            type="submit"
            className="contact-button"
            disabled={isSubmitting || !isFormValid || Object.values(values).some((value) => !value.trim())}
            aria-label="Send message"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          <p className="contact-status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

export default memo(ContactSection);
