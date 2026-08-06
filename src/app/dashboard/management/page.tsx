'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userManagementApi } from '@/services/userManagementApi';
import { User, UserRole, UserStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Shield, UserPlus, Trash2, Mail, Lock, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function ManagementPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isSystemOwner = currentUser?.role === 'SYSTEM_OWNER';
  const isManager = currentUser?.role === 'MANAGER';

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userManagementApi.getAllUsers(),
  });

  // Filter for management team (System Owner, Managers, Staff)
  const managementUsers = (data?.data || []).filter(
    (u) => u.role === 'STAFF' || u.role === 'MANAGER' || u.role === 'SYSTEM_OWNER'
  );

  const createStaffMutation = useMutation({
    mutationFn: () => userManagementApi.createStaff({ name, email, passwordHash: password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Staff account created successfully!');
      setIsStaffModalOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const createManagerMutation = useMutation({
    mutationFn: () => userManagementApi.createManager({ name, email, passwordHash: password }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Manager account created successfully!');
      setIsManagerModalOpen(false);
      resetForm();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userManagementApi.changeUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Account status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userManagementApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Role updated successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userManagementApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Account deleted successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }
    createStaffMutation.mutate();
  };

  const handleManagerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('All fields are required');
      return;
    }
    createManagerMutation.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header with Right Top Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Management & Staff</h1>
          <p className="text-xs text-slate-500 mt-1">
            System owners, managers, and operational staff team members
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(isSystemOwner || isManager) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetForm();
                setIsStaffModalOpen(true);
              }}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Staff
            </Button>
          )}

          {isSystemOwner && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetForm();
                setIsManagerModalOpen(true);
              }}
              leftIcon={<Shield className="w-4 h-4" />}
            >
              Create Manager
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Member</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {managementUsers.map((member) => {
                const isSelf = member.id === currentUser?.id;
                const isOwner = member.role === 'SYSTEM_OWNER';

                return (
                  <tr key={member.id} className="hover:bg-slate-50/80">
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                      <Avatar src={member.avatarUrl} name={member.name} size="sm" />
                      <div>
                        <span>{member.name}</span>
                        {isSelf && (
                          <span className="block text-[10px] text-emerald-600 font-bold">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{member.email}</td>
                    <td className="p-4">
                      {isSystemOwner && !isOwner ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            changeRoleMutation.mutate({
                              id: member.id,
                              role: e.target.value as UserRole,
                            })
                          }
                          className="bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs font-bold text-emerald-800 cursor-pointer"
                        >
                          <option value="USER">USER</option>
                          <option value="STAFF">STAFF</option>
                          <option value="MANAGER">MANAGER</option>
                        </select>
                      ) : (
                        <Badge
                          variant={
                            isOwner
                              ? 'amber'
                              : member.role === 'MANAGER'
                              ? 'primary'
                              : 'neutral'
                          }
                        >
                          {member.role}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          member.status === 'ACTIVE'
                            ? 'success'
                            : member.status === 'SUSPENDED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {member.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {!isOwner && !isSelf && (
                        <>
                          <Button
                            variant={member.status === 'ACTIVE' ? 'amber' : 'outline'}
                            size="sm"
                            onClick={() =>
                              changeStatusMutation.mutate({
                                id: member.id,
                                status: member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                              })
                            }
                          >
                            {member.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete management account "${member.name}"?`)) {
                                deleteUserMutation.mutate(member.id);
                              }
                            }}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create Staff */}
      <Modal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        title="Create Staff Member"
      >
        <form onSubmit={handleStaffSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Staff Member Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="staff@sobjibazar.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={createStaffMutation.isPending}
          >
            Create Staff Account
          </Button>
        </form>
      </Modal>

      {/* Modal: Create Manager */}
      <Modal
        isOpen={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
        title="Create Manager Account"
      >
        <form onSubmit={handleManagerSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Manager Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leftIcon={<UserIcon className="w-4 h-4" />}
            required
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="manager@sobjibazar.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />
          <Button
            type="submit"
            variant="primary"
            className="w-full bg-emerald-700 hover:bg-emerald-800"
            isLoading={createManagerMutation.isPending}
          >
            Create Manager Account
          </Button>
        </form>
      </Modal>
    </div>
  );
}
