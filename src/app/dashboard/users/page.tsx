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
import { Users, Shield, Ban, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function ManageUsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [suspendDays, setSuspendDays] = useState<number>(7);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => userManagementApi.getAllUsers(),
  });

  const users = data?.data || [];

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      userManagementApi.changeUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User status updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const suspendUserMutation = useMutation({
    mutationFn: ({ id, days }: { id: string; days: number }) =>
      userManagementApi.suspendUser(id, days),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User suspended for ${suspendDays} days`);
      setSelectedUser(null);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userManagementApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userManagementApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Manage Registered Users</h1>
        <p className="text-xs text-slate-500 mt-1">Review accounts, assign roles, activate/suspend access</p>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                    <Avatar src={u.avatarUrl} name={u.name} size="sm" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{u.email}</td>
                  <td className="p-4">
                    {currentUser?.role === 'SYSTEM_OWNER' ? (
                      <select
                        value={u.role}
                        onChange={(e) =>
                          changeRoleMutation.mutate({ id: u.id, role: e.target.value as UserRole })
                        }
                        className="bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs font-bold text-emerald-800"
                      >
                        <option value="USER">USER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="SYSTEM_OWNER">SYSTEM_OWNER</option>
                      </select>
                    ) : (
                      <Badge variant="primary">{u.role}</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        u.status === 'ACTIVE'
                          ? 'success'
                          : u.status === 'SUSPENDED'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant={u.status === 'ACTIVE' ? 'amber' : 'outline'}
                      size="sm"
                      onClick={() =>
                        changeStatusMutation.mutate({
                          id: u.id,
                          status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                        })
                      }
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                      leftIcon={<Ban className="w-3.5 h-3.5" />}
                    >
                      Suspend
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete user "${u.name}"?`)) {
                          deleteUserMutation.mutate(u.id);
                        }
                      }}
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Suspend Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Suspend User: ${selectedUser.name}`}
        >
          <div className="space-y-4">
            <Input
              label="Suspension Duration (Days)"
              type="number"
              value={suspendDays}
              onChange={(e) => setSuspendDays(Number(e.target.value))}
              required
            />
            <Button
              variant="danger"
              className="w-full"
              isLoading={suspendUserMutation.isPending}
              onClick={() =>
                suspendUserMutation.mutate({ id: selectedUser.id, days: suspendDays })
              }
            >
              Confirm Suspension
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
