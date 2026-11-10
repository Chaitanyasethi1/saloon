"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PopularService {
  name: string;
  category: string;
  duration: string;
  startingPrice: number;
  imageUrl: string;
  description: string;
}

export default function PopularServices() {
  const services: PopularService[] = [
    {
      name: "Haute Haircut & Styling",
      category: "Hair",
      duration: "45m",
      startingPrice: 1200,
      imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
      description: "Custom structural scissoring, scalp massage, luxury blowout.",
    },
    {
      name: "French Balayage & Gloss",
      category: "Color",
      duration: "120m",
      startingPrice: 5500,
      imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      description: "Hand-painted sunlit dimension with ammonia-free bonding glazes.",
    },
    {
      name: "Japanese Head Spa & Detox",
      category: "Spa",
      duration: "60m",
      startingPrice: 2800,
      imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      description: "Micro-mist exfoliation, lymphatic meridian massage, herbal infusion.",
    },
    {
      name: "Imperial Beard & Shave",
      category: "Beard",
      duration: "35m",
      startingPrice: 850,
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80",
      description: "Eucalyptus hot towel, straight razor contouring, sandalwood balm.",
    },
    {
      name: "Couture Bridal HD Makeover",
      category: "Bridal",
      duration: "120m",
      startingPrice: 15000,
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80",
      description: "Runway-grade airbrush makeup, Swarovski lash accents, floral hair art.",
    },
    {
      name: "Russian E-File Gel Nails",
      category: "Nails",
      duration: "60m",
      startingPrice: 2200,
      imageUrl: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
      description: "Clean diamond dry cuticle work, high-apex builder gel, chrome pigments.",
    },
    {
      name: "Aromatherapy Body Massage",
      category: "Spa",
      duration: "60m",
      startingPrice: 3200,
      imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
      description: "Deep tissue trigger therapy with botanical essential oils.",
    },
    {
      name: "Brazilian Keratin Luxe Infusion",
      category: "Keratin",
      duration: "90m",
      startingPrice: 4800,
      imageUrl: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
      description: "Glass hair anti-frizz smoothing lasting up to 5 months.",
    },
  ];

  return (
    <section className="py-24 bg-[#0A0A0B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3 h-3" />
              <span>Bespoke Menu</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
              Curated Services & Treatments
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 mt-2 max-w-xl font-light">
              Explore signature offerings from premier ateliers. Filter by service duration and get an instant real-time wait estimation.
            </p>
          </div>
          <Link
            href="#salons"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs font-semibold text-gold-300 hover:text-gold-200 transition-colors uppercase tracking-wider"
          >
            <span>Explore All Salons</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => (
            <Link
              key={idx}
              href={`#salons`}
              className="group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-gold-400/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-glow flex flex-col"
            >
              {/* Image container */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-[#111114]/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-gold-300 border border-gold-400/20 backdrop-blur-md">
                  {item.category}
                </span>
                <span className="absolute bottom-3 right-3 flex items-center gap-1 text-[11px] font-mono text-zinc-300 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  <Clock className="w-3 h-3 text-gold-300" />
                  <span>{item.duration}</span>
                </span>
              </div>

              {/* Text content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-200 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                      Starting from
                    </span>
                    <span className="font-mono text-sm font-bold text-white">
                      {formatCurrency(item.startingPrice)}
                    </span>
                  </div>
                  <span className="text-xs text-gold-300 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

