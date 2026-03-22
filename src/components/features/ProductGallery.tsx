import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px] pb-1 lg:pb-0">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`shrink-0 size-16 lg:size-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
              selected === i ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 relative">
        <div
          className={`relative rounded-2xl overflow-hidden aspect-[3/4] cursor-${zoomed ? 'zoom-out' : 'zoom-in'}`}
          onClick={() => setZoomed(!zoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={selected}
              src={images[selected]}
              alt={`${name} - Foto ${selected + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
              style={
                zoomed
                  ? {
                      transform: 'scale(2)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />
          </AnimatePresence>

          {!zoomed && (
            <div className="absolute bottom-3 right-3 glass rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
              <ZoomIn className="size-3.5 text-foreground/70" />
              <span className="text-xs font-body text-foreground/70">Zoom</span>
            </div>
          )}
        </div>

        {/* Mobile arrows */}
        {images.length > 1 && (
          <div className="lg:hidden">
            <button
              onClick={() => setSelected((s) => (s - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full glass flex items-center justify-center"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setSelected((s) => (s + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full glass flex items-center justify-center"
              aria-label="Próxima foto"
            >
              <ChevronRight className="size-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${
                    i === selected ? 'w-4 bg-white' : 'w-1 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
