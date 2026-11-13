import React from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Heart,
  Target,
  Eye,
  ShieldCheck,
  Smile,
  Truck,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { PawIcon } from '../components/common/PawIcon';
import { ContactCtaBar } from '../components/home/ContactCtaBar';

export const AboutPage: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Quality Products',
      desc: 'Every kibble bag, chew toy, and harness is vetted for veterinary-grade safety, non-toxic materials, and nutritional authenticity.',
    },
    {
      icon: Sparkles,
      title: 'Wide Product Range',
      desc: 'From pedigree puppy nutrition to specialized avian seeds and small mammal hay, we cater to every domestic pet companion under one roof.',
    },
    {
      icon: Smile,
      title: 'Friendly Bangalore Support',
      desc: 'Our staff consists of genuine animal lovers who understand the anxiety of a new pet parent and provide patient, practical care guidance.',
    },
    {
      icon: Truck,
      title: 'Affordable & Reliable',
      desc: 'Transparent pricing with daily discounts, free doorstep delivery across Bangalore, and hassle-free returns on unopened essentials.',
    },
  ];

  const petHighlights = [
    {
      title: 'Dogs',
      desc: 'Breed-specific kibble, orthopedic beds, durable chew ropes, and no-pull training harnesses.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Cats',
      desc: 'High-protein grain-free nutrition, sisal scratching posts, soothing fountains, and interactive toys.',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Birds',
      desc: 'Clean seed mixtures, vitamin supplements, natural fruitwood perches, and musical ladder swings.',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Small Pets',
      desc: 'High-fiber western timothy hay, rodent pellets, chew blocks, and spacious modular playpens.',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-[#EDF4E5]/50 border-b border-[#F0EAE1] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <nav className="flex items-center justify-center gap-2 text-xs text-[#666666] mb-4">
            <Link to="/" className="hover:text-[#26752C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#14532D]">About Us</span>
          </nav>

          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-[#14532D] shadow-xs border border-[#F0EAE1] mb-3">
            <PawIcon size={16} color="#F4770B" />
            <span>Bangalore's Premier Pet Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#14532D] tracking-tight">
            About Petmate
          </h1>
          <p className="text-lg sm:text-xl font-bold text-[#F4770B] mt-2">
            Your Pet's Best Friend
          </p>
          <p className="text-sm sm:text-base text-[#666666] mt-4 leading-relaxed">
            Welcome to Petmate Bangalore. We are dedicated to providing pet owners with the highest quality pet food, playful accessories, wellness products, and compassionate advice to ensure your companion lives a joyful, healthy life.
          </p>
        </div>
      </section>

      {/* Brand Story & Lifestyle Photography */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            
            {/* Story Text */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#F4770B] uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-[#F4770B]" />
                <span>Our Story</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#171717] tracking-tight leading-tight">
                Born out of a genuine passion for animal well-being.
              </h2>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                Petmate started with a simple belief: finding trustworthy, premium pet supplies shouldn't be stressful or complicated. As longtime pet parents in Bangalore, we experienced firsthand the challenge of sorting through conflicting brand claims and unreliable deliveries.
              </p>

              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                We set out to create a warm, customer-first pet store where Bangalore pet parents can walk in—or order online—with complete confidence that every single product has been vetted for nutritional balance, pet safety, and real comfort.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F0EAE1]">
                  <span className="text-2xl font-black text-[#14532D] block">5,000+</span>
                  <span className="text-xs text-[#666666] font-medium">Happy Pets Served in Bangalore</span>
                </div>
                <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#F0EAE1]">
                  <span className="text-2xl font-black text-[#F4770B] block">100%</span>
                  <span className="text-xs text-[#666666] font-medium">Genuine Verified Brand Items</span>
                </div>
              </div>
            </div>

            {/* Lifestyle Photo Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80"
                  alt="Pet parent walking with happy dog"
                  className="rounded-3xl object-cover h-64 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80"
                  alt="Cat and dog companion resting together"
                  className="rounded-3xl object-cover h-44 w-full shadow-md"
                />
              </div>
              <div className="space-y-4 pt-6">
                <img
                  src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80"
                  alt="Healthy cat resting comfortably indoors"
                  className="rounded-3xl object-cover h-44 w-full shadow-md"
                />
                <img
                  src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80"
                  alt="Dog enjoying gentle grooming session"
                  className="rounded-3xl object-cover h-64 w-full shadow-md"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-12 bg-white border-y border-[#F0EAE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-[#FFF9F0] rounded-3xl p-8 border border-[#F0EAE1] shadow-xs relative overflow-hidden">
              <div className="w-12 h-12 bg-[#EDF4E5] text-[#26752C] rounded-2xl flex items-center justify-center mb-5">
                <Target className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#14532D] mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                To empower Bangalore pet parents with uncompromising access to premium pet nutrition, durable accessories, and compassionate guidance—making joyful pet care simple, accessible, and worry-free.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-[#FFF9F0] rounded-3xl p-8 border border-[#F0EAE1] shadow-xs relative overflow-hidden">
              <div className="w-12 h-12 bg-[#FFF3DC] text-[#F4770B] rounded-2xl flex items-center justify-center mb-5">
                <Eye className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#14532D] mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-[#666666] leading-relaxed">
                To be celebrated as Karnataka's most trusted pet care community, renowned for genuine quality, knowledgeable customer support, and ethical animal-first practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Petmate Pillars */}
      <section className="py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-[#171717] tracking-tight">
              Why Pet Parents Trust Petmate
            </h2>
            <p className="text-sm text-[#666666] mt-2">
              Our core commitments to your pet's happiness, health, and comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 border border-[#F0EAE1] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#EDF4E5] text-[#26752C] flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#171717] mb-2">{pillar.title}</h3>
                    <p className="text-xs text-[#666666] leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pet Categories Showcase */}
      <section className="py-12 bg-[#FFFDF9] border-t border-[#F0EAE1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <PawIcon size={20} color="#F4770B" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717]">
                Complete Essentials for Every Pet
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#666666]">
              Whether you care for a lively puppy, curious kitten, singing budgie, or gentle bunny.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {petHighlights.map((pet, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-[#F0EAE1] shadow-xs hover:shadow-md transition-all group"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={pet.image}
                    alt={pet.title}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-[#14532D]">{pet.title}</h3>
                  <p className="text-xs text-[#666666] leading-relaxed">{pet.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="text-center pt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-7 py-3 rounded-full text-sm shadow-md transition-all"
            >
              <span>Explore Our Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-7 py-3 rounded-full text-sm shadow-md transition-all"
            >
              <span>Contact Petmate Team</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <ContactCtaBar />
    </div>
  );
};
