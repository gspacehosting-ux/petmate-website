import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { PawIcon } from '../common/PawIcon';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFDF9] rounded-3xl sm:rounded-4xl p-6 sm:p-10 lg:p-12 border border-[#F0EAE1] shadow-xs relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Decorative radiant dashes above Pet Needs */}
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-1 ml-32 sm:ml-40">
                  <span className="w-1.5 h-3 bg-[#F4770B] rounded-full -rotate-25 transform inline-block"></span>
                  <span className="w-1.5 h-4 bg-[#F4770B] rounded-full inline-block"></span>
                  <span className="w-1.5 h-3 bg-[#F4770B] rounded-full rotate-25 transform inline-block"></span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#171717] tracking-tight leading-[1.12]">
                  Everything Your <br />
                  <span className="text-[#F4770B]">Pet Needs</span> <br />
                  Under One Roof!
                </h1>
              </div>

              <p className="text-base sm:text-lg text-[#666666] max-w-lg leading-relaxed font-normal">
                Premium pet food, accessories, grooming essentials and more for your furry friends.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2.5 bg-[#F4770B] hover:bg-[#e06c09] text-white font-bold px-7 py-3.5 rounded-full text-base shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>
              </div>
            </div>

            {/* Right Photo Column with Dog & Cat */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Dog & Cat cozy photo */}
                <div className="overflow-hidden rounded-3xl sm:rounded-4xl shadow-md border-4 border-white bg-[#FFF9F0]">
                  <img
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=85"
                    alt="Golden retriever dog and cute cat cuddling together"
                    className="w-full h-[320px] sm:h-[400px] lg:h-[440px] object-cover object-center transform hover:scale-102 transition-transform duration-500"
                  />
                </div>

                {/* Scalloped badge: Bangalore's Trusted Pet Shop */}
                <div className="absolute -top-4 -right-3 sm:-top-6 sm:-right-4 w-28 h-28 sm:w-34 sm:h-34 bg-[#14532D] text-white rounded-full flex flex-col items-center justify-center p-2 text-center shadow-xl border-4 border-[#EDF4E5] transform rotate-6 hover:rotate-0 transition-transform">
                  <PawIcon size={20} color="#FFFFFF" className="mb-0.5" />
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase opacity-90 leading-tight">
                    Bangalore's
                  </span>
                  <span className="text-xs sm:text-sm font-black tracking-tight leading-tight">
                    Trusted
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold leading-tight text-[#F4770B]">
                    Pet Shop
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
