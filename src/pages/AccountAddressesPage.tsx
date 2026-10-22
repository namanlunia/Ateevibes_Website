import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Plus,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Address } from '../types';
import { INDIAN_STATES } from '../data/states';
import { addressSchema } from '../lib/validators';

export const AccountAddressesPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const saveAddress = useAuthStore((state) => state.saveAddress);
  const deleteAddress = useAuthStore((state) => state.deleteAddress);
  const addToast = useUIStore((state) => state.addToast);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form state
  const [formData, setFormData] = useState<Address>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: 'Delhi (NCT)',
    pincode: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addresses = user?.savedAddresses || [];

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormData({
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      addressLine1: '',
      addressLine2: '',
      landmark: '',
      city: '',
      state: 'Delhi (NCT)',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (addr: Address) => {
    setEditingAddress(addr);
    setFormData({ ...addr });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = addressSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      const addrToSave: Address = {
        ...formData,
        id: editingAddress?.id || `addr_${Date.now()}`,
      };

      await saveAddress(addrToSave);
      setIsModalOpen(false);
      addToast({
        type: 'success',
        message: editingAddress
          ? 'Address updated successfully.'
          : 'New address added to your address book.',
      });
    } catch {
      addToast({
        type: 'error',
        message: 'Could not save address. Please try again.',
      });
    }
  };

  const handleDelete = async (addrId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(addrId);
      addToast({
        type: 'info',
        message: 'Address removed from your address book.',
      });
    }
  };

  const handleSetDefault = async (addr: Address) => {
    await saveAddress({ ...addr, isDefault: true });
    addToast({
      type: 'success',
      message: `${addr.city} address marked as default.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Saved Addresses</h2>
          <p className="text-xs sm:text-sm text-ink-600">
            Manage your delivery destinations for lightning-fast checkout.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-surface-tint rounded-3xl p-10 sm:p-14 border border-border text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center mx-auto text-accent-700 shadow-sm">
            <MapPin className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-display text-lg font-bold text-ink-900">No saved addresses yet</h3>
            <p className="text-xs text-ink-600">
              Add your home, office, or standard shipping address to speed up future orders.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary px-5 py-2 text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Address Now</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-6 rounded-3xl border transition-all ${
                addr.isDefault
                  ? 'bg-white border-accent-700 ring-2 ring-accent-700/10 shadow-sm'
                  : 'bg-surface-tint border-border hover:border-ink-900'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-ink-900">{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 rounded-full bg-accent-700/10 text-accent-700 text-[10px] font-extrabold uppercase tracking-wider">
                      Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(addr)}
                    className="p-1.5 text-ink-600 hover:text-ink-900 rounded-lg hover:bg-black/5 transition-colors"
                    title="Edit address"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => addr.id && handleDelete(addr.id)}
                    className="p-1.5 text-ink-600 hover:text-status-error rounded-lg hover:bg-black/5 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-ink-700 leading-relaxed min-h-[50px]">
                {addr.addressLine1}
                {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                {addr.landmark ? ` (Near ${addr.landmark})` : ''}
                <br />
                {addr.city}, {addr.state} - <span className="font-bold">{addr.pincode}</span>
              </p>

              <div className="pt-3 mt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-ink-600 font-medium">📞 {addr.phone}</span>

                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr)}
                    className="text-[11px] font-bold text-accent-700 hover:underline"
                  >
                    Set as default
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add / Edit Address Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-border p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar z-10 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-display text-xl font-bold text-ink-900">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-full text-ink-600 hover:text-ink-900 hover:bg-black/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                    />
                    {errors.fullName && (
                      <p className="text-[10px] text-status-error">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900 tabular-nums"
                    />
                    {errors.phone && (
                      <p className="text-[10px] text-status-error">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-ink-900">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-status-error">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase text-ink-900">
                    Address Line 1 (Flat, House, Building) *
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                  />
                  {errors.addressLine1 && (
                    <p className="text-[10px] text-status-error">{errors.addressLine1}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Address Line 2 (Area, Street)
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2 || ''}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.landmark || ''}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                    />
                    {errors.city && (
                      <p className="text-[10px] text-status-error">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase text-ink-900">PIN Code *</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm bg-surface-tint border border-border rounded-xl focus:outline-none focus:border-ink-900 tabular-nums"
                    />
                    {errors.pincode && (
                      <p className="text-[10px] text-status-error">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-ink-900 focus:ring-0 border-border"
                  />
                  <span className="text-xs text-ink-700 font-medium">
                    Make this my default shipping address
                  </span>
                </label>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-ink-600 hover:text-ink-900"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary px-5 py-2 text-xs font-bold">
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
