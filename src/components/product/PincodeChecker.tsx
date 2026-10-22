import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { pinCodeRegex } from '../../lib/validators';

export const PincodeChecker: React.FC = () => {
  const [pincode, setPincode] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'serviceable' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pincode.trim();

    if (!pinCodeRegex.test(clean) || clean.startsWith('9')) {
      setStatus('error');
      setMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setStatus('checking');
    setTimeout(() => {
      setStatus('serviceable');
      setMessage('Delivery in 3 to 7 business days • Cash on Delivery available');
    }, 350);
  };

  return (
    <div className="p-4 rounded-2xl bg-surface-tint border border-border space-y-2">
      <div className="flex items-center gap-2 text-xs font-bold text-ink-900 uppercase tracking-wide">
        <MapPin className="w-4 h-4 text-accent-700" />
        <span>Check Delivery & COD Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/\D/g, ''));
            if (status !== 'idle') setStatus('idle');
          }}
          placeholder="Enter 6-digit PIN code (e.g. 395002)"
          className="flex-1 px-4 py-2 bg-white border border-border focus:border-ink-900 rounded-xl text-xs font-medium text-ink-900 placeholder:text-ink-600/60 focus:outline-none tabular-nums"
        />
        <button
          type="submit"
          disabled={status === 'checking'}
          className="btn-secondary px-4 py-2 text-xs font-bold whitespace-nowrap"
        >
          {status === 'checking' ? 'Checking...' : 'Check'}
        </button>
      </form>

      {status === 'serviceable' && (
        <div className="flex items-center gap-1.5 text-xs text-status-success font-medium pt-1">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-1.5 text-xs text-status-error font-medium pt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};
