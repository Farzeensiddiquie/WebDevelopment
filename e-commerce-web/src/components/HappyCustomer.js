'use client'
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const HappyCustomers = () => {
  const { getCurrentScheme } = useTheme();
  const scheme = getCurrentScheme();

  const testimonials = [
    { id: 1, name: 'Sarah M.', review: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations." },
    { id: 2, name: 'Alex K.', review: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions." },
    { id: 3, name: 'James L.', review: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends." },
    { id: 4, name: 'Emma T.', review: "The customer service at Shop.co is exceptional. They helped me find the perfect outfit for my anniversary and even followed up to ensure I was happy with my purchase." },
    { id: 5, name: 'Liam W.', review: "Shop.co has become my go-to for all things fashion. The delivery is quick, and the quality is always top-notch. Highly recommended!" },
    { id: 6, name: 'Olivia R.', review: "I love the variety and the easy shopping experience. The website is user-friendly and the support team is always helpful." },
    { id: 7, name: 'Noah D.', review: "Great prices, great styles, and great service. I always find something new and exciting at Shop.co!" },
    { id: 8, name: 'Priya S.', review: "Absolutely love the trendy collection and fast shipping. Shop.co never disappoints!" },
    { id: 9, name: 'Carlos F.', review: "The best online store for men's fashion. The fit and quality are always perfect." },
    { id: 10, name: 'Emily B.', review: "I get compliments every time I wear something from Shop.co. Highly recommend!" },
    { id: 11, name: 'Zara P.', review: "Easy returns and great customer support. Shopping here is always a pleasure." },
    { id: 12, name: 'Tom H.', review: "Affordable prices and premium quality. My wardrobe is now 90% Shop.co!" },
    { id: 13, name: 'Ava G.', review: "Love the eco-friendly packaging and the unique styles. Will shop again!" },
    { id: 14, name: 'Mia N.', review: "The best place to find gifts for friends and family. Everyone loves it!" },
    { id: 15, name: 'Sofia L.', review: "Super fast delivery and the clothes look even better in person." },
  ];

  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1); // Always 1 on SSR
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const getVisibleCount = () => {
      if (window.innerWidth >= 1280) return 4;
      if (window.innerWidth >= 768) return 3;
      return 1;
    };
    setVisibleCount(getVisibleCount());
    const handleResize = () => setVisibleCount(getVisibleCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Move carousel by one card at a time
  const nextTestimonials = () => {
    setStartIndex((prev) => {
      const maxStart = Math.max(0, testimonials.length - visibleCount);
      const next = prev + 1;
      if (next > maxStart) return maxStart;
      return next;
    });
  };

  const prevTestimonials = () => {
    setStartIndex((prev) => {
      const prevIdx = prev - 1;
      if (prevIdx < 0) return 0;
      return prevIdx;
    });
  };

  // Get the visible testimonials for the carousel (paginated, not circular)
  const getVisibleTestimonials = () => {
    if (visibleCount >= testimonials.length) {
      return testimonials;
    }
    // Always show first N cards on first page
    if (startIndex === 0) {
      return testimonials.slice(0, visibleCount);
    }
    // If last page and not enough cards, show last full set
    if (startIndex + visibleCount > testimonials.length) {
      return testimonials.slice(testimonials.length - visibleCount, testimonials.length);
    }
    return testimonials.slice(startIndex, startIndex + visibleCount);
  };

  // Adjust navigation to not wrap around
  const canGoPrev = startIndex > 0 && visibleCount < testimonials.length;
  const canGoNext = (startIndex + visibleCount < testimonials.length) && visibleCount < testimonials.length;

  return (
    <section className={`mt-10 py-12 px-4 max-w-7xl mx-auto overflow-x-hidden mb-7 ${scheme.card} rounded-[24px] shadow-md border ${scheme.border}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-3xl sm:text-4xl font-extrabold uppercase tracking-tight ${scheme.text} pl-2`}>
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="flex gap-3 mr-2 sm:mr-0">
          <button
            onClick={prevTestimonials}
            className={`${scheme.card} rounded-full p-2 shadow border ${scheme.border} z-10 ${!canGoPrev ? 'opacity-50' : ''} ${scheme.text}`}
            aria-label="Previous testimonials"
            disabled={!canGoPrev}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextTestimonials}
            className={`${scheme.card} rounded-full p-2 shadow border ${scheme.border} z-10 ${!canGoNext ? 'opacity-50' : ''} ${scheme.text}`}
            aria-label="Next testimonials"
            disabled={!canGoNext}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel Row with smooth sliding animation */}
      <div className="w-full py-6 overflow-hidden">
        <div
          className="flex flex-nowrap transition-transform duration-500 gap-3 sm:gap-4 md:gap-6"
          style={{
            width: `${(testimonials.length * 100) / visibleCount}%`,
            transform: `translateX(-${startIndex * (100 / testimonials.length)}%)`,
            willChange: 'transform',
          }}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={`${scheme.card} rounded-2xl shadow-md p-7 border ${scheme.border} flex flex-col min-h-[220px] h-[240px] max-h-[240px] max-w-[350px] w-full flex-shrink-0`}
              style={{
                width: `calc(100% / ${testimonials.length})`,
                minWidth: 0,
              }}
            >
              {/* Stars */}
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                ))}
              </div>
              <div className="flex items-center mb-2">
                <h3 className={`text-base font-bold ${scheme.text} mr-2`}>{testimonial.name}</h3>
                {/* Green checkmark */}
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
              </div>
              <p className={`${scheme.textSecondary} text-sm leading-relaxed`}>&quot;{testimonial.review}&quot;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HappyCustomers;