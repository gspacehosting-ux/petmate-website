import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { PawIcon } from '../common/PawIcon';

export const GroomingBanner: React.FC = () => {
  const reasons = [
    'Wide Range of Quality Products',
    'Trusted & Pet-Friendly Service',
    'Expert Pet Care Guidance',
    'Affordable Prices & Great Offers',
  ];

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Grooming Banner (approx 7 cols) */}
          <div className="lg:col-span-7 bg-[#EDF4E5] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#26752C]/10 shadow-xs relative overflow-hidden">
            
            <div className="space-y-4 max-w-sm z-10 text-left">
              <div className="flex items-center gap-2">
                <PawIcon size={24} color="#26752C" />
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#14532D] leading-tight">
                  Pet Grooming &amp; Care Services
                </h3>
              </div>
              <p className="text-sm text-[#444444] leading-relaxed">
                Keep your pets clean, healthy and happy with our professional care.
              </p>
              <div className="pt-2">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 bg-[#14532D] hover:bg-[#26752C] text-white font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Grooming dog image with soapy head */}
            <div className="w-full sm:w-60 h-52 sm:h-64 rounded-2xl overflow-hidden shrink-0 shadow-sm border-2 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=80"
                alt="Golden retriever being washed with shampoo foam"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right: Why Choose Petmate? (approx 5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-center border border-[#F0EAE1] shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <PawIcon size={24} color="#F4770B" />
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#171717] tracking-tight">
                Why Choose Petmate?
              </h3>
            </div>

            <div className="space-y-4">
              {reasons.map((reason, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#EDF4E5] text-[#26752C] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-[#171717]">
                    {reason}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
