import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { getProductSrcSet, PRODUCT_IMAGE_SIZES } from '../../lib/images';

interface ProductLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ProductLightbox: React.FC<ProductLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
  title,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage, onClose]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox"
        className="fixed inset-0 z-[130] bg-ink-900/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between text-white/80 z-20">
          <div>
            <p className="text-xs uppercase tracking-widest text-brand-green font-bold">Catalog High-Res View</p>
            <h4 className="font-display text-sm sm:text-base font-bold text-white line-clamp-1">{title}</h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-white/10 backdrop-blur rounded-full px-2 py-1 gap-1 border border-white/20">
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                aria-label="Zoom out"
                className="p-1 text-white hover:text-brand-green"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs px-1 tabular-nums font-bold text-white">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                aria-label="Zoom in"
                className="p-1 text-white hover:text-brand-green"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={() => setZoomLevel(1)}
                  aria-label="Reset zoom"
                  className="p-1 text-white hover:text-brand-green"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close lightbox"
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Center Canvas */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-4">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            srcSet={getProductSrcSet(images[currentIndex])}
            sizes={PRODUCT_IMAGE_SIZES}
            alt={title}
            onError={(e) => {
              e.currentTarget.srcset = '';
              e.currentTarget.src = '/brand/placeholder.svg';
            }}
            style={{ transform: `scale(${zoomLevel})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="max-h-[80vh] max-w-[90vw] object-contain transition-transform duration-200 select-none cursor-grab active:cursor-grabbing rounded-lg shadow-2xl"
          />

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Bar */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-20">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setZoomLevel(1);
                }}
                className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                  currentIndex === i ? 'border-brand-green scale-105' : 'border-white/20 opacity-50'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
