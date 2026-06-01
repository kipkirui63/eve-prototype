import { useState } from 'react'
import { IconEye, IconLeaf } from '../ui/Icons'

function LoginPage({
  onBackHome,
  onSubmit,
  mode,
  authError,
  isLoading,
  onModeChange,
}: {
  onBackHome: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  mode: 'login' | 'register'
  authError: string
  isLoading: boolean
  onModeChange: (mode: 'login' | 'register') => void
}) {
  const isRegistering = mode === 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#f0f4f0] px-4 py-8 sm:px-6 md:px-10">
      <div className="w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-[24px] border border-[#cdd9d0] shadow-[0_32px_80px_rgba(14,53,40,0.12)] lg:grid-cols-2">

          {/* ── Left: Form panel ── */}
          <div className="flex flex-col bg-white px-10 py-10 sm:px-12 sm:py-12">

            {/* 1. Logo + tagline */}
            <div className="mb-10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b4332] text-white shadow-sm">
  <IconLeaf size={22} />
</div>
                <span className="text-[18px] font-semibold tracking-[-0.03em] text-[#1b4332]">
                  Eco<span className="text-[#52796f]">Verify</span>
                </span>
              </div>
              <p className="mt-2 pl-[55px] text-[11.5px] font-medium tracking-[0.12em] text-[#7a9e8e] uppercase">
                Verify. Badge. Sell.
              </p>
            </div>

            {/* 2. Heading */}
            <div className="mb-8">
              <h1 className="font-['DM_Serif_Display',serif] text-[34px] font-normal leading-[1.1] tracking-[-0.02em] text-[#1b4332]">
                {isRegistering ? 'Create your merchant account.' : 'Welcome back.'}
              </h1>
              <p className="mt-2 text-[13px] leading-relaxed text-[#52796f]">
                {isRegistering
                  ? 'Register your merchant account before submitting verification evidence.'
                  : 'Sign in to manage your sustainability profile and trust badges.'}
              </p>
            </div>

            {/* 3. Form */}
            <form onSubmit={onSubmit} className="flex flex-col gap-4">

              {/* Email */}
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-[#1b4332]">
                  Business Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="amina@verdantthread.co"
                  autoComplete="email"
                  className="w-full rounded-[10px] border border-[#cdd9d0] bg-[#f6f9f6] px-4 py-3 text-[13px] text-[#1b4332] placeholder-[#a8bdb4] outline-none transition-colors focus:border-[#1b4332] focus:bg-white"
                />
              </label>

              {isRegistering && (
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-[#1b4332]">
                    Phone Number
                  </span>
                  <input
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="+254 700 000 000"
                    autoComplete="tel"
                    className="w-full rounded-[10px] border border-[#cdd9d0] bg-[#f6f9f6] px-4 py-3 text-[13px] text-[#1b4332] placeholder-[#a8bdb4] outline-none transition-colors focus:border-[#1b4332] focus:bg-white"
                  />
                </label>
              )}

              {/* Password */}
              <label className="block">
                <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-[#1b4332]">
                  Password
                </span>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={isRegistering ? 8 : undefined}
                    placeholder="••••••••"
                    autoComplete={isRegistering ? 'new-password' : 'current-password'}
                    className="w-full rounded-[10px] border border-[#cdd9d0] bg-[#f6f9f6] px-4 py-3 pr-12 text-[13px] text-[#1b4332] placeholder-[#a8bdb4] outline-none transition-colors focus:border-[#1b4332] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#52796f] transition-colors hover:bg-[#e8f0eb] hover:text-[#1b4332]"
                  >
                    <IconEye size={18} />
                  </button>
                </div>
              </label>

              {isRegistering ? (
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-semibold tracking-[0.04em] text-[#1b4332]">
                    Confirm Password
                  </span>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-[10px] border border-[#cdd9d0] bg-[#f6f9f6] px-4 py-3 pr-12 text-[13px] text-[#1b4332] placeholder-[#a8bdb4] outline-none transition-colors focus:border-[#1b4332] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#52796f] transition-colors hover:bg-[#e8f0eb] hover:text-[#1b4332]"
                    >
                      <IconEye size={18} />
                    </button>
                  </div>
                </label>
              ) : (
                <button
                  type="button"
                  className="-mt-2 self-end text-[12px] text-[#2d6a4f] transition-opacity hover:opacity-70"
                >
                  Forgot password?
                </button>
              )}

              {authError && (
                <p className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[12px] font-medium text-red-700">
                  {authError}
                </p>
              )}

              {/* Sign In */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-[10px] bg-[#1b4332] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#163829] disabled:cursor-not-allowed disabled:bg-[#8aa095]"
              >
                {isLoading ? 'Please wait...' : isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* 4. Register link */}
            <p className="mt-5 text-center text-[13px] text-[#52796f]">
              {isRegistering ? 'Already registered?' : 'New merchant?'}{' '}
              <button
                type="button"
                onClick={() => onModeChange(isRegistering ? 'login' : 'register')}
                className="font-semibold text-[#1b4332] underline-offset-2 transition-opacity hover:underline hover:opacity-80"
              >
                {isRegistering ? 'Sign in here' : 'Register here'}
              </button>
            </p>

            {/* 5. Trust statement */}
            <div className="mt-8 flex items-center gap-3 rounded-[10px] bg-[#f0f7f2] px-4 py-3.5">
              <div className="flex shrink-0 -space-x-2">
                {['#2d6a4f', '#52796f', '#74a58a'].map((color, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-white"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <p className="text-[12px] leading-snug text-[#2d6a4f]">
                <span className="font-semibold">Join 1,200+ verified</span> sustainable brands already trusted by eco-conscious shoppers.
              </p>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center text-[11px] text-[#a8bdb4]">
              All rights reserved EcoVerify Technologies 2026
            </p>
          </div>

          {/* ── Right: Image panel ── */}
          <div className="relative flex min-h-[520px] items-end overflow-hidden p-8">

            {/* Full-bleed background image */}
            <img
              src="/image.png"
              alt="Sustainable product display"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Gradient overlay — heavier at bottom for card legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />

            {/* Leaf icon top-right */}
            <div className="absolute right-9 top-9 z-10 flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/15 backdrop-blur-sm">
              <IconLeaf size={20} className="text-white" />
            </div>

            {/* Back button top-left */}
            <button
              type="button"
              onClick={onBackHome}
              aria-label="Go back home"
              className="absolute left-8 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/25 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Content card — pinned to bottom */}
            <div className="relative z-10 w-full rounded-[14px] border border-white/20 bg-white/10 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.25)] backdrop-blur-md">
              <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <p className="font-['DM_Serif_Display',serif] text-[17px] font-normal leading-[1.25] text-white">
                Sustainability is the new gold standard for commerce
              </p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/70">
                Upload proof documents and earn a dynamic trust badge. Verified merchants
                see up to 40% higher conversion from eco-conscious shoppers.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-white" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/35" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default LoginPage
