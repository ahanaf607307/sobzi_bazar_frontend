'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { updateUser } from '@/redux/slices/authSlice';
import { authApi } from '@/services/authApi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { User as UserIcon, Camera, Key, Mail, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Change password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await authApi.updateProfile(formData);
      dispatch(updateUser(res.data));
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error('Please enter both current and new password');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Login Required</h2>
        <p className="text-sm text-slate-500">Please log in to manage your account details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal info and security preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-600" /> Personal Details
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <Avatar src={user.avatarUrl} name={user.name} size="xl" />
              <div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors">
                  <Camera className="w-4 h-4" /> Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
                    }}
                    className="hidden"
                  />
                </label>
                {avatarFile && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              value={user.email}
              disabled
              leftIcon={<Mail className="w-4 h-4" />}
              className="bg-slate-100 text-slate-500 cursor-not-allowed"
            />

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Role: <strong className="text-emerald-700 uppercase">{user.role}</strong></span>
              <span className="ml-auto bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                {user.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdatingProfile}
              className="w-full"
            >
              Save Profile Changes
            </Button>
          </form>
        </div>

        {/* Security / Password Change */}
        <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-600" /> Change Password
          </h3>

          <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="outline"
              isLoading={isChangingPassword}
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
