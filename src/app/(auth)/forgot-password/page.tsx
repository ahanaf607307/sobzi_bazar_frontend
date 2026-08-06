'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/authApi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Leaf, Mail, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your registered email address');
      return;
    }
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      toast.success('OTP sent to your email!');
      setStep('verify');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP code');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.verifyForgotPasswordOtp(email, otp);
      toast.success('OTP verified! You can now reset your password.');
      if (res.data?.resetToken) {
        localStorage.setItem('accessToken', res.data.resetToken);
      }
      router.push('/reset-password');
    } catch (err: any) {
      toast.error(err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-8 animate-scaleUp">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-600/30">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {step === 'request' ? 'Forgot Password?' : 'Verify OTP'}
          </h2>
          <p className="text-xs text-slate-500">
            {step === 'request'
              ? 'Enter your email to receive a password reset verification code'
              : `Enter the verification code sent to ${email}`}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Send Verification OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <Input
              label="OTP Verification Code"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Verify OTP
            </Button>

            <button
              type="button"
              onClick={() => setStep('request')}
              className="w-full text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              Change Email Address
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-500 font-medium">
          Remember your password?{' '}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Back to Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
