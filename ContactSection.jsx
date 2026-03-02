import React, { memo, useCallback, useMemo, useState } from 'react';
import './ContactSection.css';

const initialValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const validators = {
  name: (value) => {
    if (!value.trim()) return 'Name is required.';
    if (value.trim().length < 2) return 'Name must be at least 2 characters.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Email is required.';
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    return isValid ? '' : 'Please enter a valid email address.';
  },
  subject: (value) => {
    if (!value.trim()) return 'Subject is required.';
    if (value.trim().length < 3) return 'Subject must be at least 3 characters.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Message is required.';
    if (value.trim().length < 10) return 'Message must be at least 10 characters.';
    return '';
  },
};

const validateField = (name, value) => validators[name]?.(value) ?? '';

const InputField = memo(function InputField({
  id,
  name,
  label,
  type = 'text',
  value,
  error,
  touched,
  onBlur,
  onChange,
  required = true,
}) {
  const hasError = touched && Boolean(error);

  return (
    <div className="contact-field">
      <label className="contact-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        className={`contact-input${hasError ? ' is-error' : ''}`}
        type={type}
        value={value}
        required={required}
        autoComplete={name}
        aria-label={label}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        onBlur={onBlur}
        onChange={onChange}
      />
      {hasError && (
        <p id={`${id}-error`} className="contact-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

const TextareaField = memo(function TextareaField({
  id,
  name,
  label,
  value,
  error,
  touched,
  onBlur,
  onChange,
  required = true,
  rows = 6,
}) {
  const hasError = touched && Boolean(error);

  return (
    <div className="contact-field">
      <label className="contact-label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        className={`contact-textarea${hasError ? ' is-error' : ''}`}
        value={value}
        required={required}
        rows={rows}
        aria-label={label}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        onBlur={onBlur}
        onChange={onChange}
      />
      {hasError && (
        <p id={`${id}-error`} className="contact-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

function ContactSection() {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(
    () =>
      Object.keys(values).reduce((acc, key) => {
        acc[key] = validateField(key, values[key]);
        return acc;
      }, {}),
    [values]
  );

  const isFormValid = useMemo(
    () => Object.values(errors).every((error) => !error),
    [errors]
  );

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setValues((prev) => (prev[name] === value ? prev : { ...prev, [name]: value }));
  }, []);

  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      if (!isFormValid) return;

      try {
        setIsSubmitting(true);
        // Replace with production API call.
        await new Promise((resolve) => setTimeout(resolve, 600));
        setValues(initialValues);
        setTouched({});
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, values]
  );

  return (
    <section className="contact-section" aria-labelledby="contact-title">
      <div className="contact-container">
        <h2 id="contact-title" className="contact-title">
          Contact
        </h2>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <InputField
            id="contact-name"
            name="name"
            label="Name"
            value={values.name}
            error={errors.name}
            touched={touched.name}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          <InputField
            id="contact-email"
            name="email"
            label="Email"
            type="email"
            value={values.email}
            error={errors.email}
            touched={touched.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          <InputField
            id="contact-subject"
            name="subject"
            label="Subject"
            value={values.subject}
            error={errors.subject}
            touched={touched.subject}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          <TextareaField
            id="contact-message"
            name="message"
            label="Message"
            value={values.message}
            error={errors.message}
            touched={touched.message}
            onBlur={handleBlur}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="contact-button"
            disabled={!isFormValid || isSubmitting}
            aria-label="Send contact form"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default memo(ContactSection);
