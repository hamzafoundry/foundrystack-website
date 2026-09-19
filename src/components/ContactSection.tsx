import React, { useState } from 'react';
import { ContactFormData, ContactResponse } from '../types';
import {
  Mail,
  MessageCircle,
  Instagram,
  Linkedin,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  Terminal
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ContactSectionProps {
  preselectedProjectType?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedProjectType = '' }) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    projectType: preselectedProjectType || t.contact.fields.projectTypeOptions[0],
    description: '',
    budget: '',
    website_url_hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ContactResponse | null>(null);
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  // Synchronize preselected project type when passed from props
  React.useEffect(() => {
    if (preselectedProjectType) {
      setFormData((prev) => ({ ...prev, projectType: preselectedProjectType }));
    }
  }, [preselectedProjectType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResponse(data);

      if (data.success) {
        // Reset form on success
        setFormData({
          name: '',
          company: '',
          email: '',
          phone: '',
          projectType: t.contact.fields.projectTypeOptions[0],
          description: '',
          budget: '',
          website_url_hp: '',
        });
      }
    } catch (err) {
      console.error('Contact submission error:', err);
      setResponse({
        success: false,
        error: t.contact.response.failDefault,
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(label);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <section id="contact" className="py-24 bg-[#020617] relative border-t border-slate-800/80">
      {/* Background Ambient Lighting */}
      <div className="absolute inset-0 bg-tech-grid opacity-40 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-widest">
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.contact.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-heading">
            {t.contact.title}
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Business Channels */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-blue-900/40 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-3">
                <Terminal className="w-4 h-4" />
                <span>{t.contact.directChannelsTitle}</span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {t.contact.directChannelsDesc}
              </p>

              <div className="space-y-4 pt-2">
                
                {/* Business Email */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-950 text-cyan-400 border border-blue-800">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {t.contact.labels.email}
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        hamza@foundrystack.net
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('hamza@foundrystack.net', 'Email')}
                    className="p-2 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedChannel === 'Email' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* WhatsApp */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {t.contact.labels.whatsapp}
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        +212766057959
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('+212766057959', 'WhatsApp')}
                    className="p-2 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy WhatsApp"
                  >
                    {copiedChannel === 'WhatsApp' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Instagram */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-950 text-cyan-400 border border-blue-800">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {t.contact.labels.instagram}
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        @foundrystack
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('@foundrystack', 'Instagram')}
                    className="p-2 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy Handle"
                  >
                    {copiedChannel === 'Instagram' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* LinkedIn */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        {t.contact.labels.linkedin}
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        linkedin.com/company/foundrystack
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('https://linkedin.com/company/foundrystack', 'LinkedIn')}
                    className="p-2 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    title="Copy LinkedIn URL"
                  >
                    {copiedChannel === 'LinkedIn' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 font-mono">
              <span className="text-cyan-400 font-bold block mb-1">{t.contact.noticeTitle}</span>
              {t.contact.noticeText}
            </div>

          </div>

          {/* Right Column: Functional Form */}
          <div className="lg:col-span-7">
            
            <form
              onSubmit={handleSubmit}
              className="glass-panel rounded-2xl p-6 sm:p-8 border border-blue-500/30 shadow-2xl space-y-6"
            >
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold text-white font-heading">
                  {t.contact.formTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.contact.formSubtitle}
                </p>
              </div>

              {/* Success / Error Response Alert */}
              {response && (
                <div
                  className={`p-4 rounded-xl border text-sm font-medium flex items-start gap-3 animate-in fade-in ${
                    response.success
                      ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                      : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  }`}
                >
                  {response.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block mb-1">
                      {response.success
                        ? `${t.contact.response.successTitle} (${response.inquiryId || ''})`
                        : t.contact.response.failTitle}
                    </span>
                    <p className="text-xs leading-relaxed opacity-90">
                      {response.message || response.error || (response.success ? t.contact.response.successDefault : t.contact.response.failDefault)}
                    </p>
                  </div>
                </div>
              )}

              {/* Form Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Honeypot field for bot protection */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="website_url_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_url_hp || ''}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t.contact.fields.name} <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.contact.fields.placeholders.name}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t.contact.fields.company}
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder={t.contact.fields.placeholders.company}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t.contact.fields.email} <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.contact.fields.placeholders.email}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    {t.contact.fields.phone}
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t.contact.fields.placeholders.phone}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans"
                  />
                </div>

              </div>

              {/* Project Type Select */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t.contact.fields.projectType} <span className="text-cyan-400">*</span>
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors font-sans cursor-pointer"
                >
                  {t.contact.fields.projectTypeOptions.map((typeOption) => (
                    <option key={typeOption} value={typeOption} className="bg-slate-900 text-white">
                      {typeOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  {t.contact.fields.description} <span className="text-cyan-400">*</span>
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t.contact.fields.placeholders.description}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans resize-y"
                />
              </div>

              {/* Flexible Budget / Custom Price Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
                    {t.contact.fields.budget} <span className="text-slate-500 font-normal lowercase">{t.contact.fields.budgetFlexible}</span>
                  </label>
                  <span className="text-[11px] font-mono text-cyan-400">{t.contact.fields.customSupported}</span>
                </div>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder={t.contact.fields.placeholders.budget}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors font-sans"
                />
                
                {/* Flexible Quick Suggestions */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{t.contact.fields.quickFill}</span>
                  {t.contact.fields.presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, budget: preset }))}
                      className={`text-[11px] px-2.5 py-1 rounded-md border font-mono transition-all cursor-pointer ${
                        formData.budget === preset
                          ? 'bg-blue-950/90 text-cyan-300 border-blue-500 shadow-sm'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-400/40 shadow-[0_0_25px_rgba(0,102,255,0.4)] transition-all duration-300 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-300" />
                    <span>{t.contact.processing}</span>
                  </>
                ) : (
                  <>
                    <span>{t.contact.submitButton}</span>
                    <Send className="w-4 h-4 text-cyan-300" />
                  </>
                )}
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
