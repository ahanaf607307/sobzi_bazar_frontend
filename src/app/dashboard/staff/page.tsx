'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { userManagementApi } from '@/services/userManagementApi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserPlus, ShieldAlert, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreateStaffManagerPage() {
  const { user } = useSelector((state: RootState) => state.auth);

  const isSystemOwner = user?.role === 'SYSTEM_OWNER';
  const isManager = user?.role === 'MANAGER';

  // Manager form
  const [mName, setMName] = useState('');
  const [mEmail, setMEmail] = useState('');
  const [mPassword, setMPassword] = useState('');
  const [isCreatingManager, setIsCreatingManager] = useState(false);

  // Staff form
  const [sName, setSName] = useState('');
  const [sEmail, setSEmail] = useState('');
  const [sPassword, setSPassword] = useState('');
  const [isCreatingStaff, setIsCreatingStaff] = useState(false);

  const handleCreateManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingManager(true);
    try {
      await userManagementApi.createManager({
        name: mName,
        email: mEmail,
        passwordHash: mPassword,
      });
      toast.success(`Manager account created for ${mName}!`);
      setMName('');
      setMEmail('');
      setMPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create manager');
    } finally {
      setIsCreatingManager(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingStaff(true);
    try {
      await userManagementApi.createStaff({
        name: sName,
        email: sEmail,
        passwordHash: sPassword,
      });
      toast.success(`Staff account created for ${sName}!`);
      setSName('');
      setSEmail('');
      setSPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create staff');
    } finally {
      setIsCreatingStaff(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Provision Accounts</h1>
        <p className="text-xs text-slate-500 mt-1">
          Create new System Manager or Operations Staff accounts
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Manager (SYSTEM_OWNER only) */}
        {isSystemOwner ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Create Manager</h3>
                <p className="text-xs text-slate-500">Full catalog & user authority</p>
              </div>
            </div>

            <form onSubmit={handleCreateManager} className="space-y-4">
              <Input
                label="Manager Name"
                placeholder="e.g. Alice Smith"
                value={mName}
                onChange={(e) => setMName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="manager@sobji.com"
                value={mEmail}
                onChange={(e) => setMEmail(e.target.value)}
                required
              />

              <Input
                label="Initial Password"
                type="password"
                placeholder="••••••••"
                value={mPassword}
                onChange={(e) => setMPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="amber"
                isLoading={isCreatingManager}
                className="w-full"
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Provision Manager
              </Button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center flex flex-col items-center justify-center text-slate-400 space-y-2">
            <ShieldAlert className="w-8 h-8 text-amber-500" />
            <p className="text-xs font-semibold">Manager Provisioning is restricted to System Owner.</p>
          </div>
        )}

        {/* Create Staff (SYSTEM_OWNER & MANAGER) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Create Operations Staff</h3>
              <p className="text-xs text-slate-500">Order & product management access</p>
            </div>
          </div>

          <form onSubmit={handleCreateStaff} className="space-y-4">
            <Input
              label="Staff Name"
              placeholder="e.g. Bob Johnson"
              value={sName}
              onChange={(e) => setSName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="staff@sobji.com"
              value={sEmail}
              onChange={(e) => setSEmail(e.target.value)}
              required
            />

            <Input
              label="Initial Password"
              type="password"
              placeholder="••••••••"
              value={sPassword}
              onChange={(e) => setSPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isCreatingStaff}
              className="w-full"
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Provision Staff Account
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
