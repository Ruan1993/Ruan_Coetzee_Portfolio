import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { submitContactForm } from '../services/web3forms';
import type { ContactFormValues } from '../services/web3forms';

type SubmissionStatus =
  | { state: 'idle'; message: '' }
  | { state: 'loading' | 'success' | 'error'; message: string };

const initialStatus: SubmissionStatus = { state: 'idle', message: '' };

function readFormValues(form: HTMLFormElement): ContactFormValues {
  const data = new FormData(form);
  return {
    name: String(data.get('name') ?? ''),
    email: String(data.get('email') ?? ''),
    phone: String(data.get('phone') ?? ''),
    message: String(data.get('message') ?? ''),
  };
}

function trackSuccessfulEnquiry() {
  const analyticsWindow = window as Window & { gtag?: (command: string, eventName: string) => void };
  analyticsWindow.gtag?.('event', 'enquiry_submitted');
}

export function ContactForm() {
  const [status, setStatus] = useState<SubmissionStatus>(initialStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ?? '';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submissionInProgress.current) return;

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setStatus({ state: 'loading', message: 'Sending your message…' });
    const form = event.currentTarget;

    try {
      const result = await submitContactForm(readFormValues(form), accessKey);
      if (result.success) {
        trackSuccessfulEnquiry();
        form.reset();
        setStatus({ state: 'success', message: '✅ Message Sent! Thank you.' });
      } else {
        setStatus({ state: 'error', message: `❌ Error: ${result.message}` });
      }
    } catch {
      setStatus({ state: 'error', message: '❌ Network error. Please try again.' });
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-heading">
      <p className="eyebrow">Get in touch</p>
      <h2 id="contact-heading">Contact Ruan</h2>
      <p>Have a question or want to work together? Fill out the form below and I’ll get back to you soon.</p>
      <form className="contact-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <div className="form-field">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" placeholder="Enter your full name" autoComplete="name" required disabled={isSubmitting} />
        </div>
        <div className="form-field">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="Enter your email address" autoComplete="email" required disabled={isSubmitting} />
        </div>
        <div className="form-field">
          <label htmlFor="contact-phone">Phone (optional)</label>
          <input id="contact-phone" name="phone" type="tel" placeholder="Enter your phone number (optional)" autoComplete="tel" pattern="[0-9+\-\s()]*" disabled={isSubmitting} />
        </div>
        <div className="form-field">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={5} placeholder="Write your message here..." required disabled={isSubmitting} />
        </div>
        <button className="button button--primary submit-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        {status.state !== 'idle' ? (
          <p className={`form-status form-status--${status.state}`} role={status.state === 'error' ? 'alert' : 'status'} aria-live={status.state === 'error' ? 'assertive' : 'polite'}>
            {status.message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
