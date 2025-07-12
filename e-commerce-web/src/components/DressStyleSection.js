'use client'
import ProgressLink from './ProgressLink';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

const DressStyleSection = () => {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const stylesData = [
    {
      name: 'Casual',
      img: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Formal',
      img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Party',
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Gym',
      img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80'
    },
  ];

  return (
    <section className={`mt-10 py-10 px-4 max-w-[1100px] w-full mx-auto ${scheme.card} rounded-[24px] shadow-md border ${scheme.border}`}>
      <h2 className={`text-center text-[28px] font-black uppercase tracking-wider mb-8 ${scheme.text}`} style={{ letterSpacing: '1px' }}>
        BROWSE BY DRESS STYLE
      </h2>

      <div className="grid grid-cols-4 sm:grid-cols-12 gap-4">
        {stylesData.map((style, idx) => (
          <ProgressLink
            key={style.name}
            href={`/search?q=${encodeURIComponent(style.name)}`}
            className={`relative h-[200px] rounded-[16px] overflow-hidden ${scheme.card} shadow-md border ${scheme.border} ${idx === 0 || idx === 3 ? 'sm:col-span-4' : 'sm:col-span-8'}`}
          >
            <Image
              src={style.img}
              alt={style.name}
              className="w-full h-full object-cover opacity-70"
              style={{ objectPosition: 'top' }}
              fill
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <span className={`absolute top-3 left-4 text-[20px] font-bold ${scheme.text} drop-shadow-lg`}>
              {style.name}
            </span>
          </ProgressLink>
        ))}
      </div>
    </section>
  );
};

export default DressStyleSection;
