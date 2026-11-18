import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { SectionHeader } from './SectionHeader';

export interface ProjectTypePreselect {
  index: number;
  /** Changes on every request so the same choice can be re-applied after the visitor edits the field */
  tick: number;
}

interface ContactSectionProps {
  preselect: ProjectTypePreselect;
}

const EMAIL = 'hamza@foundrystack.net';

const CHANNELS = [
  { key: 'email', value: EMAIL, href: `mailto:${EMAIL}` },
  { key: 'whatsapp', value: '+212 766 057 959', href: 'https://wa.me/212766057959' },
  { key: 'instagram', value: '@foundrystack', href: 'https://instagram.com/foundrystack' },
  { key: 'linkedin', value: 'linkedin.com/company/foundrystack', href: 'https://linkedin.com/company/foundrystack' },
] as const;

const emptyForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  description: '',
  budget: '',
  website_url_hp: '',
};

type Outcome = { ok: true; reference?: string } | { ok: false };

export const ContactSection: React.FC<ContactSectionProps> = ({ preselect }) => {
  const { t } = useLanguage();
  const c = t.contact;
  const f = c.fields;

  const [form, setForm] = useState(emptyForm);
  // Store the option index, not its text, so the choice survives a language switch
  const [projectTypeIndex, setProjectTypeIndex] = useState(preselect.index);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  useEffect(() => {
    setProjectTypeIndex(preselect.index);
  }, [preselect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutcome(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectType: f.projectTypeOptions[projectTypeIndex] }),
      });
      const data = await res.json();
      // The server answers in English; visitors see our own message in their language instead.
      if (data.success) {
        setOutcome({ ok: true, reference: data.inquiryId });
        setForm(emptyForm);
        setProjectTypeIndex(0);
      } else {
        setOutcome({ ok: false });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setOutcome({ ok: false });
    } finally {
      setLoading(false);
    }
  };

  const Required = () => (
    <span className="text-brand-deep" aria-hidden="true">
      {' '}*
    </span>
  );

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={c.title} description={c.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <h3 className="font-semibold text-ink">{c.directTitle}</h3>
            <p className="mt-2 text-ink-2 leading-relaxed">{c.directDesc}</p>
            <dl className="mt-8 border-t border-line">
              {CHANNELS.map((ch) => (
                <div key={ch.key} className="border-b border-line">
                  <dt className="sr-only">{c.labels[ch.key]}</dt>
                  <dd>
                    <a
                      href={ch.href}
                      target={ch.key === 'email' ? undefined : '_blank'}
                      rel={ch.key === 'email' ? undefined : 'noopener noreferrer'}
                      className="channel-link group"
                    >
                      <span className="min-w-0">
                        <span className="block text-sm text-ink-3">{c.labels[ch.key]}</span>
                        <span className="block text-lg font-medium text-ink break-all" dir="ltr">
                          {ch.value}
                        </span>
                      </span>
                      <ArrowUpRight className="channel-arrow" aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-surface border border-line rounded-[6px] p-6 sm:p-10">
            {outcome && (
              <div
                role={outcome.ok ? 'status' : 'alert'}
                className={`form-outcome mb-8 p-4 rounded-[4px] border-s-4 ${
                  outcome.ok ? 'bg-[#E6F4EC] border-[#13795B] text-[#0B4F3B]' : 'bg-[#FBEAEA] border-[#B42318] text-[#7A1A12]'
                }`}
              >
                <p className="font-semibold">{outcome.ok ? c.successTitle : c.errorTitle}</p>
                <p className="mt-1 text-sm">{outcome.ok ? c.successText : c.errorText}</p>
                {outcome.ok && outcome.reference && (
                  <p className="mt-2 text-sm">
                    {c.reference}: <span dir="ltr">{outcome.reference}</span>
                  </p>
                )}
              </div>
            )}

            {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website_url_hp" tabIndex={-1} autoComplete="off" value={form.website_url_hp} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              <div className="field">
                <label htmlFor="cf-name" className="field-label">
                  {f.name}
                  <Required />
                </label>
                <input id="cf-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} placeholder={f.placeholders.name} className="field-input" />
              </div>
              <div className="field">
                <label htmlFor="cf-company" className="field-label">
                  {f.company}
                </label>
                <input id="cf-company" name="company" type="text" autoComplete="organization" value={form.company} onChange={handleChange} placeholder={f.placeholders.company} className="field-input" />
              </div>
              <div className="field">
                <label htmlFor="cf-email" className="field-label">
                  {f.email}
                  <Required />
                </label>
                <input id="cf-email" name="email" type="email" required autoComplete="email" dir="ltr" value={form.email} onChange={handleChange} placeholder={f.placeholders.email} className="field-input text-start" />
              </div>
              <div className="field">
                <label htmlFor="cf-phone" className="field-label">
                  {f.phone}
                </label>
                <input id="cf-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={handleChange} placeholder={f.placeholders.phone} className="field-input text-start" />
              </div>

              <div className="field sm:col-span-2">
                <label htmlFor="cf-type" className="field-label">
                  {f.projectType}
                  <Required />
                </label>
                <select id="cf-type" name="projectType" value={projectTypeIndex} onChange={(e) => setProjectTypeIndex(Number(e.target.value))} className="field-input cursor-pointer">
                  {f.projectTypeOptions.map((option, i) => (
                    <option key={option} value={i}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field sm:col-span-2">
                <label htmlFor="cf-description" className="field-label">
                  {f.description}
                  <Required />
                </label>
                <textarea id="cf-description" name="description" required rows={5} value={form.description} onChange={handleChange} placeholder={f.placeholders.description} className="field-input resize-y" />
              </div>

              <div className="field sm:col-span-2">
                <label htmlFor="cf-budget" className="field-label">
                  {f.budget}
                </label>
                <input id="cf-budget" name="budget" type="text" value={form.budget} onChange={handleChange} placeholder={f.placeholders.budget} className="field-input" />
                <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={f.quickPick}>
                  <span className="text-sm text-ink-3 me-1">{f.quickPick}</span>
                  {f.presets.map((preset) => {
                    const isActive = form.budget === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setForm((prev) => ({ ...prev, budget: preset }))}
                        className="chip"
                      >
                        {isActive && <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" />}
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="press mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[3px] bg-brand text-white font-semibold hover:bg-brand-deep disabled:opacity-60 disabled:cursor-wait cursor-pointer">
              {loading && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
              {loading ? c.sending : c.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
