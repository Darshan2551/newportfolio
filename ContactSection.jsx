import React, { useEffect, useRef, useState } from 'react';
import './ContactSection.css';

const initialForm = {
  fullName: '',
  email: '',
  message: '',
};

const ContactSection = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Handles field updates while clearing field-specific errors.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  // Validates all fields before a mock submission.
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required.';
    } else if (formData.message.trim().length < 12) {
      newErrors.message = 'Message should be at least 12 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Mock submit flow with success feedback.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSuccessMessage('Thanks Darshan! Your message has been sent successfully.');
    setFormData(initialForm);
    setErrors({});
  };

  // Triggers fade-in animation when section enters viewport.
  useEffect(() => {
    const target = sectionRef.current;

    if (!target) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`contact-section ${isVisible ? 'is-visible' : ''}`}
      aria-labelledby="contact-heading"
    >
      <div className="contact-card">
        <header className="contact-header">
          <h2 id="contact-heading">Let&apos;s Connect</h2>
          <p>
            Building high-impact AI systems and full-stack products? Let&apos;s discuss your
            vision.
          </p>
        </header>

        <div className="contact-content">
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                placeholder=" "
              />
              <label htmlFor="fullName">Full Name</label>
              {errors.fullName && (
                <p id="fullName-error" className="error-text">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="input-group">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder=" "
              />
              <label htmlFor="email">Email</label>
              {errors.email && (
                <p id="email-error" className="error-text">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="input-group">
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
                placeholder=" "
              />
              <label htmlFor="message">Message</label>
              {errors.message && (
                <p id="message-error" className="error-text">
                  {errors.message}
                </p>
              )}
            </div>

            <button type="submit" className="send-btn">
              Send Message
            </button>

            {successMessage && <p className="success-text">{successMessage}</p>}
          </form>

          <aside className="contact-info" aria-label="Contact details">
            <h3>Contact Info</h3>
            <ul>
              <li>
                <span>Email</span>
                <a href="mailto:darshanaradhya20@gmail.com">darshanaradhya20@gmail.com</a>
              </li>
              <li>
                <span>Phone</span>
                <a href="tel:+917676171065">7676171065</a>
              </li>
              <li>
                <span>GitHub</span>
                <a
                  href="https://github.com/darshantar"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  github.com/darshantar
                </a>
              </li>
              <li>
                <span>LinkedIn</span>
                <a
                  href="https://www.linkedin.com/in/darshan-aradhya"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  linkedin.com/in/darshan-aradhya
                </a>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
