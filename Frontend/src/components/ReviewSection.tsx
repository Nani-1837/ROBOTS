import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Camera, Send, MessageSquare, User as UserIcon, CheckCircle2, Image as ImageIcon, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ReviewSectionProps {
  productId: string;
  user: any;
}

export default function ReviewSection({ productId, user }: ReviewSectionProps) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);


  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${productId}`);
      const data = await response.json();
      if (response.ok) setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to write a review', 'info');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('rating', rating.toString());
    formData.append('comment', comment);
    images.forEach(img => formData.append('images', img));

    try {
      const token = localStorage.getItem('insforgeToken');
      const response = await fetch(`http://localhost:5000/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        showToast('Review submitted successfully!', 'success');
        setComment('');
        setImages([]);
        setRating(5);
        fetchReviews();
      } else {
        showToast(data.message || 'Error submitting review', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (images.length + selectedFiles.length > 5) {
        showToast("Maximum 5 images allowed", 'error');
        return;
      }
      setImages([...images, ...selectedFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <section className="mt-24 pt-20 border-t border-[var(--border-subtle)]">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left: Review List */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-black text-[var(--text-main)] font-display flex items-center gap-3">
              Customer <span className="text-primary italic">Reviews</span>
              <span className="text-sm bg-[var(--bg-secondary)] px-3 py-1 rounded-full text-[var(--text-muted)] font-bold">
                {reviews.length}
              </span>
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          ) : reviews.length === 0 ? (
            <div className="p-12 rounded-[2.5rem] bg-[var(--bg-secondary)]/30 border border-dashed border-[var(--border-subtle)] text-center">
              <MessageSquare className="mx-auto text-slate-300 mb-4" size={40} />
              <p className="text-[var(--text-muted)] font-medium">No reviews yet. Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-4">

              {reviews.map((review, i) => (
                <motion.div 
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-3xl bg-[var(--bg-secondary)]/30 border border-[var(--border-subtle)] hover:border-primary/20 transition-all group"
                >

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center text-primary font-bold overflow-hidden border border-primary/10">
                        {review.user?.avatar ? <img src={review.user.avatar} className="w-full h-full object-cover" /> : <UserIcon size={16} />}
                      </div>

                      <div>
                        <h4 className="text-[var(--text-main)] font-black text-sm uppercase tracking-wider flex items-center gap-2">
                          {review.name}
                          <CheckCircle2 size={14} className="text-blue-500" />
                        </h4>
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mt-1">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-orange-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>

                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4 font-medium">
                    {review.comment}
                  </p>


                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {review.images.map((img: string, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => setExpandedImage(img)}
                          className="w-20 h-20 rounded-2xl overflow-hidden border border-[var(--border-subtle)] group/img relative cursor-zoom-in"
                        >
                           <img src={img} className="w-full h-full object-cover transition-transform group-hover/img:scale-110" />
                        </div>
                      ))}

                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Write a Review Form */}
        <div className="lg:w-80">
          <div className="sticky top-32 p-6 rounded-[2rem] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl shadow-black/5">
            <h3 className="text-lg font-black text-[var(--text-main)] mb-4 font-display uppercase tracking-wider">Write a Review</h3>

            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="text-orange-400 transition-transform hover:scale-125"
                    >
                      <Star 
                        size={28} 
                        fill={(hover || rating) >= star ? "currentColor" : "none"} 
                        strokeWidth={2}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Share your experience</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like about this product?"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] focus:border-primary px-5 py-4 rounded-2xl text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all min-h-[120px] resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Add Photos (Max 5)</label>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square relative rounded-xl overflow-hidden border border-[var(--border-subtle)]">
                      <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-slate-900 hover:text-red-500"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="aspect-square rounded-xl bg-[var(--bg-secondary)] border border-dashed border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary transition-all cursor-pointer">
                      <Camera size={20} />
                      <input type="file" hidden multiple onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>


              <button
                type="submit"
                disabled={isSubmitting || !user}
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-xs shadow-xl shadow-slate-900/10 hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:grayscale"
              >
                {isSubmitting ? <ImageIcon className="animate-bounce" size={18} /> : <Send size={18} />}
                {isSubmitting ? 'Publishing...' : 'Publish Review'}
              </button>

              {!user && <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">Please login to write a review</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Image Expansion Modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 bg-black/95 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-auto rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedImage} className="w-full h-full object-contain" />
              <button 
                onClick={() => setExpandedImage(null)}
                className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/10"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>

  );
}
