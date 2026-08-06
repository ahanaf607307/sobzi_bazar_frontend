'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/services/productApi';
import { ProductCategory } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageCategoriesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => productApi.getAllCategories(),
  });

  const categories = data?.data || [];

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: ProductCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      if (editingCategory) {
        return productApi.updateCategory(editingCategory.id, { name, description });
      } else {
        return productApi.createCategory({ name, description });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['public-categories'] });
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      setIsModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['public-categories'] });
      toast.success('Category deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Categories</h1>
          <p className="text-xs text-slate-500 mt-1">Create, edit, or delete product categories</p>
        </div>
        <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add Category
        </Button>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-600" /> {cat.name}
                  </td>
                  <td className="p-4 text-slate-500 font-mono">{cat.slug}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {cat.description || 'N/A'}
                  </td>
                  <td className="p-4">
                    <Badge variant={cat.isActive ? 'success' : 'danger'}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(cat)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete category "${cat.name}"?`)) {
                          deleteMutation.mutate(cat.id);
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

      {/* Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          <Input
            label="Category Name"
            placeholder="e.g. Leafy Greens"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Short category summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={saveMutation.isPending}
            className="w-full mt-4"
          >
            {editingCategory ? 'Save Changes' : 'Create Category'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
