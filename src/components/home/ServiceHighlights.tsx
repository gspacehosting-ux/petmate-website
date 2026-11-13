import React from 'react';
import { Truck, ShieldCheck, Headphones, Gift } from 'lucide-react';

export const ServiceHighlights: React.FC = () => {
  const highlights = [
    {
      icon: Truck,
      title: 'Fast & Safe Delivery',
      subtitle: 'Across Bangalore',
    },
    {
      icon: ShieldCheck,
      title: '100% Genuine',
      subtitle: 'Products',
    },
    {
      icon: Headphones,
      title: 'Pet Care',
      subtitle: 'Support',
    },
    {
      icon: Gift,
      title: 'Best Deals',
      subtitle: '& Offers',
    },
  ];

  return (
    <section className="py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#F0EAE1]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3.5 px-3 py-2 ${
                    index > 1 ? 'pt-4 md:pt-2' : ''
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#EDF4E5] text-[#26752C] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-[#171717] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#666666] font-medium leading-tight mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
