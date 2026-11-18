import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Scissors,
  Apple,
  ShieldCheck,
  HeartHandshake,
  Calendar,
  Send,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { PawIcon } from '../components/common/PawIcon';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const ServicesPage: React.FC = () => {
  const { addSubmission } = useAdmin();
  const { showToast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [petType, setPetType] = useState('Dog');
  const [serviceRequired, setServiceRequired] = useState('Pet Grooming & Spa Bath');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expanded details for modal or in-place accordion
  const [expandedService, setExpandedService] = useState<string | null>(null);

  const services = [
    {
      id: 'grooming',
      title: 'Pet Grooming & Spa',
      icon: Scissors,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80',
      description: 'Gentle, stress-free de-shedding spa baths, coat styling, ear hygiene, and pain-free nail trimming by patient handlers.',
      details: 'Our Bangalore salon uses hypoallergenic, tear-free organic conditioners. Every session is timed to your pet\'s comfort pace without aggressive restraints or loud stress triggers.',
    },
    {
      id: 'nutrition',
      title: 'Food & Nutrition Guidance',
      icon: Apple,
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=700&q=80',
      description: 'Personalized meal advice tailored to your pet’s breed, weight, activity level, and food sensitivities.',
      details: 'From transition plans for sensitive puppy stomachs to specialized senior kidney support diets, our nutritional advisors help you navigate authentic feed brands.',
    },
    {
      id: 'accessories',
      title: 'Pet Accessories & Harness Fitting',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=700&q=80',
      description: 'Professional custom fitting for no-pull harnesses, reflective collars, travel crates, and orthopedic pet beds.',
      details: 'Prevent choking and chafing. Bring your furry friend in for exact girth and neck sizing with our certified pet gear specialists in Bangalore.',
    },
    {
      id: 'assistance',
      title: 'Pet Care Assistance',
      icon: HeartHandshake,
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80',
      description: 'Hands-on practical advice for new pet parents on puppy-proofing, litter box habits, and crate comfort.',
      details: 'Got a newly adopted rescue or mischievous young kitten? We provide practical checklists and daily routines to make home acclimation smooth and tear-free.',
    },
    {
      id: 'wellness',
      title: 'Pet Wellness Guidance',
      icon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=700&q=80',
      description: 'Daily hygiene guidance, tick & flea prevention protocols, dental care chew routines, and joint mobility supplements.',
      details: 'Proactive non-medical home care routines that keep skin healthy, teeth clean, and tails wagging happily through every season in Bangalore.',
    },
  ];

  const handleEnquireClick = (serviceTitle: string) => {
    setServiceRequired(serviceTitle);
    const formEl = document.getElementById('enquiry-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !phone.trim() || !email.trim()) {
      showToast('Missing Details', 'Please fill in your name, phone number, and email address.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addSubmission({
        formType: 'Service Enquiry Form',
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        petType,
        serviceRequired,
        preferredDate: preferredDate || 'Flexible',
        message: message.trim() || `Requested booking for ${serviceRequired}.`,
      });

      setIsSubmitted(true);
      setCustomerName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setPreferredDate('');
    } catch {
      // Failed - error toast already displayed by addSubmission
      // Keep form values intact so customer can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <nav className="flex items-center justify-center gap-2 text-xs text-[#666666] mb-4">
            <Link to="/" className="hover:text-[#26752C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#14532D]">Services</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-[#14532D] shadow-xs border border-[#F0EAE1] mb-3">
            <PawIcon size={16} color="#F4770B" />
            <span>Gentle & Professional Bangalore Care</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#14532D] tracking-tight">
            Complete Care for Your Furry Friends
          </h1>
          <p className="text-base sm:text-lg text-[#666666] mt-3">
            Everything you need to keep your pets happy, clean, well-nourished and comfortable.
          </p>
        </div>
      </section>

      {/* Services Grid (5 Cards) */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              Our Professional Services
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1.5">
              Friendly, certified care designed with your companion's natural habits in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              const isExpanded = expandedService === service.id;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-xs text-[#14532D] flex items-center justify-center shadow-sm">
                        <Icon className="w-5 h-5 text-[#26752C]" />
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-[#14532D] group-hover:text-[#26752C] transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">
                        {service.description}
                      </p>

                      {isExpanded && (
                        <div className="pt-2 text-xs text-[#14532D] bg-[#EDF4E5] p-3 rounded-xl border border-[#26752C]/20 animate-in fade-in duration-200">
                          {service.details}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex items-center gap-3">
                    <button
                      onClick={() => setExpandedService(isExpanded ? null : service.id)}
                      className="text-xs font-bold text-[#666666] hover:text-[#171717] px-3 py-2 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
                    >
                      {isExpanded ? 'Show Less' : 'Learn More'}
                    </button>
                    <button
                      onClick={() => handleEnquireClick(service.title)}
                      className="flex-1 bg-[#14532D] hover:bg-[#26752C] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors text-center"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pet Grooming Feature Spotlight */}
      <section className="py-14 bg-white border-y border-[#F0EAE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-[#EDF4E5]">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=80"
                alt="Golden retriever getting soapy head bath"
                className="w-full h-[360px] sm:h-[420px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-md border border-[#F0EAE1]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#14532D]">
                  <Sparkles className="w-4 h-4 text-[#F4770B]" />
                  <span>Petmate Stress-Free Grooming Promise</span>
                </div>
                <p className="text-[11px] text-[#666666] mt-0.5">
                  Calm handling, positive reinforcement, and sanitized grooming stations for every guest.
                </p>
              </div>
            </div>

            {/* Grooming Benefits & Details */}
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2">
                <PawIcon size={22} color="#F4770B" />
                <span className="text-xs font-bold text-[#F4770B] uppercase tracking-wider">
                  Spotlight Service
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
                Why Professional Grooming Matters
              </h2>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Regular grooming is essential to your pet's physical comfort and long-term health. Our certified groomers gently remove trapped dead undercoat, inspect ears, and massage the skin with pH-balanced botanicals.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    title: 'Cleanliness & Odor Control',
                    desc: 'Deep coat lathering removes accumulated city grime, dust, and Bangalore pollen.'
                  },
                  {
                    title: 'Matting Prevention & Comfort',
                    desc: 'Untangles dense fur before painful knots pull on delicate skin.'
                  },
                  {
                    title: 'Healthy Ear & Paw Care',
                    desc: 'Reduces moisture buildup in ear canals and ensures safe nail lengths for posture.'
                  },
                  {
                    title: 'Early Skin Issue Detection',
                    desc: 'Hands-on checks catch hot spots, fleas, or dry skin before they escalate.'
                  }
                ].map((b, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#EDF4E5] text-[#26752C] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#171717]">{b.title}</h4>
                      <p className="text-xs text-[#666666]">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Pet Care Matters */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
              The Four Pillars of Everyday Pet Care
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] mt-1.5">
              A balanced pet lifestyle is built on consistent, caring habits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Cleanliness',
                desc: 'Fresh water bowls, clean bedding, and regular grooming sessions keep bacterial skin irritation away.',
              },
              {
                title: 'Comfort',
                desc: 'Ergonomic harnesses, supportive orthopedic beds, and safe toys foster an environment of serene security.',
              },
              {
                title: 'Daily Care',
                desc: 'Consistent daily walks, interactive play, and brushing nurture physical and emotional canine & feline balance.',
              },
              {
                title: 'Healthy Routines',
                desc: 'Scheduled meal portions and regular weight checks prevent obesity and preserve vibrant longevity.',
              },
            ].map((p, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs text-left"
              >
                <div className="text-2xl font-black text-[#F4770B] mb-2">0{i + 1}</div>
                <h3 className="text-base font-bold text-[#14532D] mb-2">{p.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Enquiry Form Section */}
      <section id="enquiry-form-section" className="py-14 bg-[#FFFDF9] border-t border-[#F0EAE1]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F0EAE1] shadow-md">
            
            <div className="text-center max-w-md mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-[#EDF4E5] text-[#14532D] text-xs font-bold px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />
                <span>Book / Inquire</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14532D]">
                Service Enquiry Form
              </h3>
              <p className="text-xs text-[#666666]">
                Tell us about your pet's needs. Our Bangalore care coordinators will get in touch to confirm your slot.
              </p>
            </div>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-[#EDF4E5] text-[#26752C] rounded-full flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <h4 className="text-xl font-black text-[#14532D]">Enquiry Received!</h4>
                <p className="text-xs sm:text-sm text-[#666666] max-w-sm mx-auto">
                  Thank you! Your enquiry has been routed to Petmate Bangalore. We will call you back shortly on your provided phone number.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-[#26752C] hover:bg-[#14532D] text-white font-bold px-6 py-2.5 rounded-full text-xs transition-colors"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#171717]">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya Deshmukh"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9845123456"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ananya@example.com"
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
                      <option value="Small Pet">Small Pet (Rabbit / Guinea Pig)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Service Required */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#171717]">
                      Service Required <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={serviceRequired}
                      onChange={(e) => setServiceRequired(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                    >
                      <option value="Pet Grooming & Spa Bath">Pet Grooming & Spa Bath</option>
                      <option value="De-shedding & Coat Detangling">De-shedding & Coat Detangling</option>
                      <option value="Food & Nutrition Guidance">Food & Nutrition Guidance</option>
                      <option value="Pet Accessories & Harness Fitting">Pet Accessories & Harness Fitting</option>
                      <option value="Pet Care Assistance">Pet Care Assistance</option>
                      <option value="Pet Wellness Guidance">Pet Wellness Guidance</option>
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#171717]">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#171717]">
                    Message / Special Pet Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your pet's breed, temperament, or specific care requests..."
                    className="w-full bg-[#FFF9F0] border border-[#F0EAE1] rounded-xl px-4 py-2.5 text-xs text-[#171717] focus:outline-hidden focus:ring-2 focus:ring-[#26752C]"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#F4770B] hover:bg-[#e06c09] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-full text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Service Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      </section>

      <ContactCtaBar />
    </div>
  );
};
