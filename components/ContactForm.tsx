"use client";

import { useId, useState } from "react";
import { WEB3FORMS_ACCESS_KEY, site } from "@/lib/site-config";

type Status = "idle" | "submitting" | "success" | "error";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: Fields): Errors {
  const errors: Errors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Please enter your name.";
  }
  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address so I can reply.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "A sentence or two about the project is enough.";
  }

  return errors;
}

const fieldClass =
  "w-full rounded-sm border border-muted bg-card px-4 py-3 text-[0.9375rem] text-ink transition-colors duration-150 placeholder:text-muted hover:border-ink focus:border-accent-strong";

export default function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<Fields>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const keyMissing = WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_KEY";

  function update(field: keyof Fields, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // No page reload, no server route — posts straight to Web3Forms, which is
    // what keeps this working on a static Vercel deployment.
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    // Honeypot: bots fill hidden inputs, humans never see this one.
    const botcheck = new FormData(event.currentTarget).get("botcheck");
    if (botcheck) return;

    setStatus("submitting");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New enquiry from ${values.name} — ${site.name}`,
          from_name: site.name,
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });

      const result = (await response.json()) as { success?: boolean };

      if (response.ok && result.success) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-md border border-hairline bg-card p-8 text-center"
      >
        <p className="font-display text-2xl leading-tight font-semibold text-ink">
          Message sent.
        </p>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-muted">
          Thank you — I&rsquo;ve got it and I&rsquo;ll reply from my inbox
          shortly. If it&rsquo;s urgent, WhatsApp is faster.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-[0.9375rem] font-semibold text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-ink"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {keyMissing ? (
        <p className="rounded-sm border border-accent-strong bg-card px-4 py-3 text-sm text-accent-strong">
          <strong className="font-semibold">Setup needed:</strong> paste your
          Web3Forms access key into <code>lib/site-config.ts</code> or this form
          will not deliver. (This notice disappears once the key is set.)
        </p>
      ) : null}

      {/* Honeypot — visually hidden, never announced to screen readers. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div>
        <label
          htmlFor={`${id}-name`}
          className="block text-sm font-semibold text-ink"
        >
          Your name
        </label>
        <input
          id={`${id}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
          className={`mt-2 ${fieldClass}`}
          placeholder="Daniel Awobodu"
        />
        {errors.name ? (
          <p id={`${id}-name-error`} className="mt-2 text-sm text-accent-strong">
            {errors.name}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`${id}-email`}
          className="block text-sm font-semibold text-ink"
        >
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${id}-email-error` : undefined}
          className={`mt-2 ${fieldClass}`}
          placeholder="you@company.com"
        />
        {errors.email ? (
          <p
            id={`${id}-email-error`}
            className="mt-2 text-sm text-accent-strong"
          >
            {errors.email}
          </p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`${id}-message`}
          className="block text-sm font-semibold text-ink"
        >
          What are you trying to automate or sell?
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-error` : undefined}
          className={`mt-2 resize-y ${fieldClass}`}
          placeholder="We get about 40 enquiries a week across WhatsApp and Instagram and nobody is on top of them…"
        />
        {errors.message ? (
          <p
            id={`${id}-message-error`}
            className="mt-2 text-sm text-accent-strong"
          >
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-sm bg-accent-strong px-6 py-3 text-[0.9375rem] font-semibold text-white shadow-[0_1px_2px_rgba(28,27,24,0.12)] transition-all duration-150 ease-out hover:bg-ink active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send message"}
        </button>

        {status === "error" ? (
          <p role="alert" className="text-sm text-accent-strong">
            That didn&rsquo;t send. Please try again, or message me on WhatsApp
            below.
          </p>
        ) : null}
      </div>

      <p className="text-sm text-muted">
        I read every message myself. No list, no newsletter.
      </p>
    </form>
  );
}
