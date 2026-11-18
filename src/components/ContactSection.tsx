import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ContactResponse } from '../types';
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

const inputClass =
  'w-full bg-white border border-line rounded-[3px] px-4 py-3 text-ink placeholder:text-ink-3/70 transition-colors focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';

export const ContactSection: React.FC<ContactSectionProps> = ({ preselect }) => {
  const { t } = useLanguage();
  const f = t.contact.fields;

  const [form, setForm] = useState(emptyForm);
  // Store the option index, not its text, so the choice survives a language switch
  const [projectTypeIndex, setProjectTypeIndex] = useState(preselect.index);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ContactResponse | null>(null);

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
    setResponse(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, projectType: f.projectTypeOptions[projectTypeIndex] }),
      });
      const data = await res.json();
      setResponse(data);
      if (data.success) {
        setForm(emptyForm);
        setProjectTypeIndex(0);
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setResponse({ success: false, message: '', error: t.contact.response.failDefault });
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
        <SectionHeader title={t.contact.title} description={t.contact.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-start">
          <div className="lg:col-span-4">
            <h3 className="font-semibold text-ink">{t.contact.directChannelsTitle}</h3>
            <p className="mt-2 text-ink-2 leading-relaxed">{t.contact.directChannelsDesc}</p>
            <dl className="mt-8 border-t border-line">
              {CHANNELS.map((c) => (
                <div key={c.key} className="py-4 border-b border-line">
                  <dt className="text-sm text-ink-3">{t.contact.labels[c.key]}</dt>
                  <dd className="mt-0.5">
                    <a
                      href={c.href}
                      target={c.key === 'email' ? undefined : '_blank'}
                      rel={c.key === 'email' ? undefined : 'noopener noreferrer'}
                      dir="ltr"
                      className="text-lg font-medium text-ink hover:text-brand-deep underline-offset-4 hover:underline break-all"
                    >
                      {c.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <form onSubmit={handleSubmit} className="lg:col-span-8 bg-surface border border-line rounded-[3px] p-6 sm:p-10" noValidate={false}>
            <h3 className="type-heading text-2xl text-ink">{t.contact.formTitle}</h3>
            <p className="mt-1.5 text-ink-2">{t.contact.formSubtitle}</p>

            {response && (
              <div
                role={response.success ? 'status' : 'alert'}
                className={`mt-6 p-4 rounded-[3px] border-s-4 ${
                  response.success ? 'bg-[#E6F4EC] border-[#13795B] text-[#0B4F3B]' : 'bg-[#FBEAEA] border-[#B42318] text-[#7A1A12]'
                }`}
              >
                <p className="font-semibold">
                  {response.success
                    ? `${t.contact.response.successTitle}${response.inquiryId ? ` (${response.inquiryId})` : ''}`
                    : t.contact.response.failTitle}
                </p>
                <p className="mt-1 text-sm">
                  {response.message || response.error || (response.success ? t.contact.response.successDefault : t.contact.response.failDefault)}
                </p>
              </div>
            )}

            {/* Honeypot: hidden from people and assistive tech, bots fill it in */}
            <div className="hidden" aria-hidden="true">
              <input type="text" name="website_url_hp" tabIndex={-1} autoComplete="off" value={form.website_url_hp} onChange={handleChange} />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6">
              <div>
                <label htmlFor="cf-name" className="block text-sm font-semibold text-ink mb-2">
                  {f.name}
                  <Required />
                </label>
                <input id="cf-name" name="name" type="text" required autoComplete="name" value={form.name} onChange={handleChange} placeholder={f.placeholders.name} className={inputClass} />
              </div>
              <div>
                <label htmlFor="cf-company" className="block text-sm font-semibold text-ink mb-2">
                  {f.company}
                </label>
                <input id="cf-company" name="company" type="text" autoComplete="organization" value={form.company} onChange={handleChange} placeholder={f.placeholders.company} className={inputClass} />
              </div>
              <div>
                <label htmlFor="cf-email" className="block text-sm font-semibold text-ink mb-2">
                  {f.email}
                  <Required />
                </label>
                <input id="cf-email" name="email" type="email" required autoComplete="email" dir="ltr" value={form.email} onChange={handleChange} placeholder={f.placeholders.email} className={`${inputClass} text-start`} />
              </div>
              <div>
                <label htmlFor="cf-phone" className="block text-sm font-semibold text-ink mb-2">
                  {f.phone}
                </label>
                <input id="cf-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" value={form.phone} onChange={handleChange} placeholder={f.placeholders.phone} className={`${inputClass} text-start`} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-type" className="block text-sm font-semibold text-ink mb-2">
                  {f.projectType}
                  <Required />
                </label>
                <select
                  id="cf-type"
                  name="projectType"
                  value={projectTypeIndex}
                  onChange={(e) => setProjectTypeIndex(Number(e.target.value))}
                  className={`${inputClass} cursor-pointer`}
                >
                  {f.projectTypeOptions.map((option, i) => (
                    <option key={option} value={i}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-description" className="block text-sm font-semibold text-ink mb-2">
                  {f.description}
                  <Required />
                </label>
                <textarea id="cf-description" name="description" required rows={5} value={form.description} onChange={handleChange} placeholder={f.placeholders.description} className={`${inputClass} resize-y`} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="cf-budget" className="block text-sm font-semibold text-ink mb-2">
                  {f.budget} <span className="font-normal text-ink-3">{f.budgetFlexible}</span>
                </label>
                <input id="cf-budget" name="budget" type="text" value={form.budget} onChange={handleChange} placeholder={f.placeholders.budget} className={inputClass} />
                <div className="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label={f.quickFill}>
                  <span className="text-sm text-ink-3 me-1">{f.quickFill}</span>
                  {f.presets.map((preset) => {
                    const isActive = form.budget === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setForm((prev) => ({ ...prev, budget: preset }))}
                        className={`text-sm px-3 py-1.5 rounded-[3px] border transition-colors cursor-pointer ${
                          isActive ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line hover:border-ink hover:text-ink'
                        }`}
                      >
                        {preset}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[3px] bg-brand text-white font-semibold hover:bg-brand-deep transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />}
              {loading ? t.contact.processing : t.contact.submitButton}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
