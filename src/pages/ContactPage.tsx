import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';
import { PawIcon } from '../components/common/PawIcon';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { settings, addSubmission } = useAdmin();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [subject, setSubject] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phoneNumber.trim() || !emailAddress.trim() || !message.trim()) {
      showToast('Validation Error', 'Please complete all required fields.', 'error');
      return;
    }

    addSubmission({
      formType: 'Contact Form',
      customerName: fullName.trim(),
      phone: phoneNumber.trim(),
      email: emailAddress.trim(),
      subject: subject.trim() || 'General Pet Inquiry',
      petType,
      message: message.trim(),
    });

    setSubmitted(true);
    setFullName('');
    setPhoneNumber('');
    setEmailAddress('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <nav className="flex items-center justify-center gap-2 text-xs text-[#666666] mb-4">
            <Link to="/" className="hover:text-[#26752C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#14532D]">Contact Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-[#14532D] shadow-xs border border-[#F0EAE1] mb-3">
            <PawIcon size={16} color="#F4770B" />
            <span>We Are Here for You &amp; Your Pet</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#14532D] tracking-tight">
            Get in Touch with Petmate
          </h1>
          <p className="text-sm sm:text-base text-[#666666] mt-3">
            Have questions about pet food choices, grooming appointments, or Bangalore deliveries? Drop us a message or reach out directly.
          </p>
        </div>
      </section>

      {/* Contact Cards Bar */}
      <section className="py-10 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Phone Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-[#EDF4E5] text-[#26752C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Call Directly</h3>
              <a
                href={`tel:${settings.phone}`}
                className="text-lg sm:text-xl font-extrabold text-[#14532D] hover:text-[#26752C] transition-colors mt-1 block"
              >
                {settings.phone}
              </a>
              <p className="text-xs text-[#666666] mt-1">Available 7 days a week</p>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-[#FFF3DC] text-[#F4770B] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Email Us</h3>
              <a
                href={`mailto:${settings.email}`}
                className="text-base sm:text-lg font-extrabold text-[#14532D] hover:text-[#26752C] transition-colors mt-1 block"
              >
                {settings.email}
              </a>
              <p className="text-xs text-[#666666] mt-1">Prompt response within 2-4 hours</p>
            </div>

            {/* Location Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-[#EDF4E5] text-[#26752C] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Store Location</h3>
              <span className="text-lg sm:text-xl font-extrabold text-[#14532D] mt-1 block">
                {settings.location}, Karnataka
              </span>
              <p className="text-xs text-[#666666] mt-1">Serving all Bangalore zones</p>
            </div>

          </div>
        </div>
      </section>

      {/* Main Form & Business Hours Grid */}
      <section className="py-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Contact Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#F0EAE1] shadow-md">
              <div className="mb-6 space-y-1">
                <h2 className="text-2xl font-black text-[#14532D]">Send Us a Message</h2>
                <p className="text-xs text-[#666666]">
                  Fill out the form below and our pet care team will respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-[#EDF4E5] text-[#26752C] rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#14532D]">Message Sent Successfully!</h4>
                  <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto">
                    Thank you, your message has been logged in our system. A Petmate representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#26752C] hover:bg-[#14532D] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#171717]">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#171717]">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g. 6363426084"
                        className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#171717]">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="e.g. you@example.com"
                        className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      />
                    </div>

                    {/* Pet Type */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#171717]">Pet Type</label>
                      <select
                        value={petType}
                        onChange={(e) => setPetType(e.target.value)}
                        className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                        <option value="Small Pet">Small Pet (Rabbit / Hamster)</option>
                        <option value="Other">Other Pet</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#171717]">Subject</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Inquiry about puppy food brand"
                      className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#171717]">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message or inquiry here..."
                      className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#14532D] hover:bg-[#26752C] text-white font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to Petmate</span>
                  </button>
                </form>
              )}
            </div>

            {/* Right: Business Hours & Google Map (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Business Hours */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0EAE1] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-base font-bold text-[#14532D]">
                  <Clock className="w-5 h-5 text-[#26752C]" />
                  <span>Business Working Hours</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-[#171717]">Monday - Saturday:</span>
                    <span className="font-bold text-[#26752C] bg-[#EDF4E5] px-2.5 py-0.5 rounded-full">
                      {settings.businessHours.weekdays.replace('Mon - Sat: ', '')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="font-semibold text-[#171717]">Sunday:</span>
                    <span className="font-bold text-[#F4770B] bg-[#FFF3DC] px-2.5 py-0.5 rounded-full">
                      {settings.businessHours.weekends.replace('Sun: ', '')}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#FFF9F0] p-3 rounded-2xl text-[11px] text-[#666666] border border-[#F0EAE1]">
                  <Info className="w-4 h-4 text-[#F4770B] shrink-0 mt-0.5" />
                  <span>
                    Note: Working hours shown are editable sample hours until officially finalized.
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-3xl p-6 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#075E54]">Fast WhatsApp Support</h4>
                  <p className="text-xs text-[#444444]">
                    Chat with our pet care specialists directly for immediate queries.
                  </p>
                </div>
                <a
                  href={settings.socialLinks.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white font-bold px-4 py-2 rounded-full text-xs shadow-xs shrink-0 transition-colors flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              {/* Google Maps Location - Bangalore */}
              <div className="bg-white rounded-3xl p-4 border border-[#F0EAE1] shadow-xs overflow-hidden">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <MapPin className="w-4 h-4 text-[#26752C]" />
                  <span className="text-xs font-bold text-[#14532D]">
                    Bangalore, Karnataka – City Map
                  </span>
                </div>
                <div className="w-full h-56 rounded-2xl overflow-hidden border border-gray-100">
                  <iframe
                    title="Bangalore Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.88653909205!2d77.4908527263592!3d12.953959988185526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
