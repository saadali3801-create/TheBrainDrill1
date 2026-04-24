/**
 * BrainDrill — ContactModal Component
 * Clean contact/suggestion form sent via mailto to saadhasitfornothing@gmail.com
 * Design: Void Interface — dark modal, amber submit, smooth transitions
 */

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
  mode: "contact" | "suggestion";
}

export default function ContactModal({
  open,
  onClose,
  mode,
}: ContactModalProps) {
  const isSuggestion = mode === "suggestion";

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = isSuggestion
      ? `BrainDrill Suggestion${form.name ? ` from ${form.name}` : ""}`
      : `BrainDrill Contact from ${form.name}`;
    const body = isSuggestion
      ? `Suggestion:\n\n${form.message}${form.name ? `\n\nFrom: ${form.name}` : ""}${form.email ? `\nEmail: ${form.email}` : ""}`
      : `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;

    const mailto = `mailto:saadhasitfornothing@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", message: "" });
      onClose();
    }, 2500);
  }

  function handleClose() {
    setForm({ name: "", email: "", message: "" });
    setSubmitted(false);
    onClose();
  }

  const inputClass =
    "w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[oklch(0.78_0.17_75/0.5)] focus:bg-white/7 transition-all duration-200";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md border-white/8 p-0 overflow-hidden shadow-2xl"
        style={{ background: "oklch(0.13 0.008 265)" }}
      >
        <div className="p-6 sm:p-7">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: "oklch(0.78 0.17 75 / 0.12)" }}
              >
                {isSuggestion ? "💬" : "✉️"}
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {isSuggestion ? "Send a Suggestion" : "Contact Us"}
              </DialogTitle>
            </div>
            <p className="text-sm text-white/35 leading-relaxed pl-13">
              {isSuggestion
                ? "Have an idea to improve BrainDrill? We'd love to hear it."
                : "Questions, feedback, or just want to say hi — we're listening."}
            </p>
          </DialogHeader>

          {submitted ? (
            <div className="text-center py-10 fade-up">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-white font-semibold text-lg mb-1">
                Opening your email client…
              </p>
              <p className="text-white/35 text-sm">Thank you for reaching out!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name field */}
              <div>
                <label className="block text-xs font-medium text-white/35 uppercase tracking-wider mb-1.5">
                  Name{isSuggestion ? " (optional)" : ""}
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required={!isSuggestion}
                  className={inputClass}
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-medium text-white/35 uppercase tracking-wider mb-1.5">
                  Email{isSuggestion ? " (optional)" : ""}
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required={!isSuggestion}
                  className={inputClass}
                />
              </div>

              {/* Message field */}
              <div>
                <label className="block text-xs font-medium text-white/35 uppercase tracking-wider mb-1.5">
                  {isSuggestion ? "Your Suggestion" : "Message"}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={
                    isSuggestion
                      ? "Share your idea or feedback…"
                      : "What's on your mind?"
                  }
                  required
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-amber w-full py-3.5 rounded-xl text-sm font-semibold mt-1"
              >
                {isSuggestion ? "Send Suggestion →" : "Send Message →"}
              </button>

              <p className="text-center text-xs text-white/20">
                Opens your email client to send to our team
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
