import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PawIcon } from '../common/PawIcon';

export const ShopByPet: React.FC = () => {
  const petCategories = [
    {
      title: 'For Dogs',
      petType: 'Dog',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-[#FFF3DC]',
      pawColor: '#F5D08C',
    },
    {
      title: 'For Cats',
      petType: 'Cat',
      image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-[#FFEAEB]',
      pawColor: '#F6BECE',
    },
    {
      title: 'For Birds',
      petType: 'Bird',
      image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-[#E3F4FC]',
      pawColor: '#A9DAF4',
    },
    {
      title: 'For Small Pets',
      petType: 'Small Pet',
      image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-[#E7F6ED]',
      pawColor: '#A8E3C1',
    },
  ];

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-8 flex items-center justify-center gap-2.5">
          <PawIcon size={24} color="#F4770B" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
            Shop by Pet
          </h2>
          <PawIcon size={24} color="#F4770B" />
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {petCategories.map((cat) => (
            <Link
              key={cat.petType}
              to={`/shop?pet=${encodeURIComponent(cat.petType)}`}
              className={`${cat.bgColor} rounded-3xl p-5 relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md group block border border-black/5`}
            >
              {/* Subtle paw print in top-right */}
              <div className="absolute top-3 right-3 opacity-30">
                <PawIcon size={42} color={cat.pawColor} />
              </div>

              {/* Pet Photo */}
              <div className="relative z-10 w-full h-44 rounded-2xl overflow-hidden mb-4 bg-white/40">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-300"
                />
              </div>

              {/* Title & Orange Arrow Button */}
              <div className="relative z-10 flex items-center justify-between pt-1">
                <h3 className="text-lg font-extrabold text-[#171717]">
                  {cat.title}
                </h3>
                <div className="w-8 h-8 rounded-full bg-[#F4770B] text-white flex items-center justify-center shadow-xs group-hover:bg-[#e06c09] transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
