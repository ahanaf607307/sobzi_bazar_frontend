'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImageUrl } from '@/services/api';
import { productApi } from '@/services/productApi';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, ShoppingBag, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ManageProductsPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [unit, setUnit] = useState('kg');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productApi.getAllProducts(),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => productApi.getAllCategories(),
  });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(100);
    setDiscount(0);
    setStock(20);
    setUnit('kg');
    setCategoryId(categories[0]?.id || '');
    setImageUrl('');
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(p.price);
    setDiscount(p.discount || 0);
    setStock(p.stock);
    setUnit(p.unit || 'kg');
    setCategoryId(p.categoryId);
    setImageUrl(p.images?.[0] || '');
    setIsFeatured(p.isFeatured);
    setIsModalOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name,
        description,
        price: Number(price),
        discount: Number(discount),
        stock: Number(stock),
        unit,
        categoryId,
        images: imageUrl ? [imageUrl] : [],
        isFeatured,
      };

      if (editingProduct) {
        return productApi.updateProduct(editingProduct.id, payload);
      } else {
        return productApi.createProduct(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['public-products'] });
      toast.success(editingProduct ? 'Product updated' : 'Product created');
      setIsModalOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['public-products'] });
      toast.success('Product deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Manage Products</h1>
          <p className="text-xs text-slate-500 mt-1">Add, update stock, pricing and discounts</p>
        </div>
        <Button variant="primary" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price / Unit</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Discount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-800 flex items-center gap-3">
                    <img
                      src={p.images?.[0] ? getImageUrl(p.images[0]) : '/placeholder-vegetable.jpg'}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded-xl border border-slate-100"
                    />
                    <div>
                      <p className="text-slate-900 font-bold">{p.name}</p>
                      {p.isFeatured && (
                        <span className="text-[10px] text-amber-600 font-bold">★ Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {p.category?.name || 'Uncategorized'}
                  </td>
                  <td className="p-4 font-black text-emerald-700">
                    ৳{p.price.toFixed(2)} / {p.unit || 'kg'}
                  </td>
                  <td className="p-4">
                    <Badge variant={p.stock > 0 ? 'success' : 'danger'}>
                      {p.stock} in stock
                    </Badge>
                  </td>
                  <td className="p-4 font-bold text-slate-700">
                    {p.discount > 0 ? `${p.discount}%` : 'None'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(p)}
                      leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Delete product "${p.name}"?`)) {
                          deleteMutation.mutate(p.id);
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

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        maxWidth="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4"
        >
          <Input
            label="Product Name"
            placeholder="e.g. Fresh Organic Tomato"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm"
                required
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Unit (e.g. kg, gram, piece)"
              placeholder="kg"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Price (৳)"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            <Input
              label="Discount (%)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
            <Input
              label="Stock Quantity"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Image URL (http...)"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">Description</label>
            <textarea
              rows={3}
              placeholder="Product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            Feature on Home Page Banner
          </label>

          <Button
            type="submit"
            variant="primary"
            isLoading={saveMutation.isPending}
            className="w-full mt-4"
          >
            {editingProduct ? 'Save Product Changes' : 'Create Product'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
