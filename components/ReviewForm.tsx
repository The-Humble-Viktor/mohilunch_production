'use client';

import { useState } from 'react';
import { submitReview } from '@/app/admin/actions';
import { StarPicker } from './StarRating';

interface ReviewFormProps {
  slug: string;
  userDisplayName: string;
  onReviewSubmitted?: () => void;
}

export function ReviewForm({ slug, userDisplayName, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitReview({
        slug,
        rating,
        body: body.trim() || null,
        anonymous,
        displayName: anonymous ? null : userDisplayName,
      });
      setSuccess(true);
      setRating(0);
      setBody('');
      onReviewSubmitted?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.startsWith('RATE_LIMIT:')) {
        const hours = msg.split(':')[1];
        setError(`You've reached the limit of 2 reviews every 24 hours. Try again in ${hours}h.`);
      } else {
        setError('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-6 text-center">
        <p className="text-emerald-400 font-semibold">Review submitted!</p>
        <p className="text-gray-500 text-sm mt-1">
          Your review is pending approval and will appear once a moderator approves it.
        </p>
        <button
          className="mt-3 text-sm text-monarch-gold hover:text-monarch-gold-light underline"
          onClick={() => setSuccess(false)}
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-monarch-border bg-monarch-surface p-5 space-y-5"
    >
      <h3 className="text-white font-semibold text-base">Leave a review</h3>

      {/* Star picker */}
      <div>
        <label className="block text-sm text-gray-400 mb-2">Your rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Body */}
      <div>
        <label htmlFor="review-body" className="block text-sm text-gray-400 mb-2">
          Review <span className="text-gray-600">(optional)</span>
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="What did you think?"
          className="w-full rounded-lg border border-monarch-border bg-[#1a1a1a] text-gray-200 placeholder-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-monarch-gold resize-none"
        />
      </div>

      {/* Anonymous toggle */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="w-4 h-4 rounded border border-monarch-border bg-[#1a1a1a] accent-monarch-gold cursor-pointer"
        />
        <span className="text-sm text-gray-400">
          Post anonymously
          {!anonymous && userDisplayName && (
            <span className="text-gray-600 ml-1">(posting as {userDisplayName})</span>
          )}
        </span>
      </label>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className="w-full py-2.5 rounded-lg bg-monarch-gold text-monarch-black font-semibold text-sm hover:bg-monarch-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
