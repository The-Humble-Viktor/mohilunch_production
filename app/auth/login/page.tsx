import Link from 'next/link';
import { GoogleSignInButton } from './GoogleSignInButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-monarch-black flex flex-col items-center justify-center px-4">
      {/* Back link */}
      <Link
        href="/"
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-monarch-gold transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to menu
      </Link>

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-monarch-gold">MohiLunch</h1>
          <p className="text-gray-500 text-sm mt-1">Monarch High School</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-monarch-border bg-monarch-surface p-8">
          <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sign in to rate today's lunch and leave reviews.
          </p>

          <GoogleSignInButton />

          <p className="text-xs text-gray-600 text-center mt-5">
            By signing in you agree to our{' '}
            <span className="text-gray-500">terms of use</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
