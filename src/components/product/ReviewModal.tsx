import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, productName }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const addToast = useUIStore((state) => state.addToast);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError('Please provide your name and review feedback.');
      return;
    }

    // SAMPLE DATA: replace before launch
    addToast({
      type: 'success',
      message: 'Review submitted! Thank you for sharing your vibes.',
      duration: 4000,
    });

    onClose();
    setName('');
    setTitle('');
    setComment('');
    setError('');
  };

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Write a Review"
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-ink-900/60 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface rounded-3xl p-6 sm:p-8 shadow-2xl border border-border z-10 space-y-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div>
              <h3 className="font-display text-xl font-bold text-ink-900">Write a Review</h3>
              <p className="text-xs text-ink-600 line-clamp-1">{productName}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close review dialog"
              className="p-2 rounded-full hover:bg-black/5 text-ink-700 hover:text-ink-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-ink-900 uppercase tracking-wide mb-1.5">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star ? 'fill-amber-400' : 'text-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-ink-900 uppercase tracking-wide mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none"
              />
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold text-ink-900 uppercase tracking-wide mb-1">
                Review Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional fabric breathability and fit"
                className="w-full px-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-ink-900 uppercase tracking-wide mb-1">
                Detailed Feedback
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about the fabric texture, comfort, size accuracy, and your overall vibe..."
                className="w-full px-4 py-2.5 bg-surface-tint border border-border focus:border-ink-900 rounded-xl text-xs sm:text-sm text-ink-900 focus:outline-none resize-none"
              />
            </div>

            {error && <p className="text-xs text-status-error font-medium">{error}</p>}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-xs font-bold text-ink-700 hover:text-ink-900"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-6 py-2.5 text-xs font-bold">
                Submit Review
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
