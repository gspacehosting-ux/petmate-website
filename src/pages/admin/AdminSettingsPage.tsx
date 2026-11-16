import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import {
  Settings,
  Save,
  RotateCcw,
  Store,
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
  FileText,
  Sparkles,
} from 'lucide-react';
import { defaultSettings } from '../../data/defaultSettings';
import { WebsiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAdmin();

  const [formSettings, setFormSettings] = useState<WebsiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  // Sync form when live settings load from Railway
  React.useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings(formSettings);
    } catch {
      // Toast error handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (window.confirm('Reset all website branding and contact settings to default?')) {
      setFormSettings(defaultSettings);
      setIsSaving(true);
      try {
        await updateSettings(defaultSettings);
      } catch {
        // Handled in context
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#14532D]">
            Website Settings &amp; Branding
          </h1>
          <p className="text-xs sm:text-sm text-[#666666] mt-1">
            Manage your store details, phone, email, Bangalore location, social handles, and footer text.
          </p>
        </div>

        <button
          onClick={handleResetToDefault}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-2 rounded-xl border border-gray-200 hover:border-red-200 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Brand Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Store className="w-4 h-4 text-[#26752C]" />
            <h3 className="text-base font-bold text-[#14532D]">General Brand Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Website / Brand Name
              </label>
              <input
                type="text"
                required
                value={formSettings.websiteName}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, websiteName: e.target.value })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                required
                value={formSettings.tagline}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, tagline: e.target.value })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Contact & Location */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <MapPin className="w-4 h-4 text-[#F4770B]" />
            <h3 className="text-base font-bold text-[#14532D]">Contact Information &amp; Location</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Official Phone Number
              </label>
              <input
                type="text"
                required
                value={formSettings.phone}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, phone: e.target.value })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Support Email
              </label>
              <input
                type="email"
                required
                value={formSettings.email}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, email: e.target.value })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                City / Location
              </label>
              <input
                type="text"
                required
                value={formSettings.location}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, location: e.target.value })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Business Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Clock className="w-4 h-4 text-[#26752C]" />
            <h3 className="text-base font-bold text-[#14532D]">Sample Business Hours</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Monday - Saturday Hours
              </label>
              <input
                type="text"
                value={formSettings.businessHours.weekdays}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    businessHours: { ...formSettings.businessHours, weekdays: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Sunday Hours
              </label>
              <input
                type="text"
                value={formSettings.businessHours.weekends}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    businessHours: { ...formSettings.businessHours, weekends: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:ring-2 focus:ring-[#26752C]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Social Media Links */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <Share2 className="w-4 h-4 text-[#F4770B]" />
            <h3 className="text-base font-bold text-[#14532D]">Social Media &amp; WhatsApp Links</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                WhatsApp Link (e.g. https://wa.me/916363426084)
              </label>
              <input
                type="text"
                value={formSettings.socialLinks.whatsapp}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    socialLinks: { ...formSettings.socialLinks, whatsapp: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formSettings.socialLinks.instagram}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    socialLinks: { ...formSettings.socialLinks, instagram: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formSettings.socialLinks.facebook}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    socialLinks: { ...formSettings.socialLinks, facebook: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={formSettings.socialLinks.youtube}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    socialLinks: { ...formSettings.socialLinks, youtube: e.target.value },
                  })
                }
                className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717]"
              />
            </div>
          </div>
        </div>

        {/* Card 5: Footer Description */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-[#26752C]" />
            <h3 className="text-base font-bold text-[#14532D]">Footer About Overview</h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#171717] mb-1">
              Footer Description Paragraph
            </label>
            <textarea
              rows={3}
              value={formSettings.footerAbout}
              onChange={(e) =>
                setFormSettings({ ...formSettings, footerAbout: e.target.value })
              }
              className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717]"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#26752C] disabled:opacity-75 text-white font-bold py-3.5 px-8 rounded-full text-sm shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Railway...' : 'Save & Apply Website Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
