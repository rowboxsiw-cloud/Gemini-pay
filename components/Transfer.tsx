
import React, { useState } from 'react';
import { ref, get, update, push, set, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../firebase';
import { UserProfile } from '../types';

interface TransferProps {
  user: UserProfile;
  onBack: () => void;
}

const Transfer: React.FC<TransferProps> = ({ user, onBack }) => {
  const [targetUpi, setTargetUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      setError('Invalid amount');
      setLoading(false);
      return;
    }

    if (payAmount > user.balance) {
      setError('Insufficient balance');
      setLoading(false);
      return;
    }

    try {
      // Find receiver by UPI ID
      const usersRef = ref(db, 'users');
      const q = query(usersRef, orderByChild('upiId'), equalTo(targetUpi.toLowerCase()));
      const snapshot = await get(q);

      if (!snapshot.exists()) {
        setError('Receiver UPI ID not found');
        setLoading(false);
        return;
      }

      const receiverUid = Object.keys(snapshot.val())[0];
      const receiverData = snapshot.val()[receiverUid] as UserProfile;

      // Atomic-ish update (simplified for React/RTDB sample)
      const now = Date.now();
      
      // Update Sender
      await update(ref(db, `users/${user.uid}`), {
        balance: user.balance - payAmount
      });
      await push(ref(db, `transactions/${user.uid}`), {
        type: 'DEBIT',
        amount: payAmount,
        fromUpiId: user.upiId,
        toUpiId: targetUpi,
        timestamp: now,
        note: note || 'Payment',
        status: 'SUCCESS'
      });

      // Update Receiver
      await update(ref(db, `users/${receiverUid}`), {
        balance: receiverData.balance + payAmount
      });
      await push(ref(db, `transactions/${receiverUid}`), {
        type: 'CREDIT',
        amount: payAmount,
        fromUpiId: user.upiId,
        toUpiId: targetUpi,
        timestamp: now,
        note: note || 'Received Payment',
        status: 'SUCCESS'
      });

      alert('Payment Successful!');
      onBack();
    } catch (err) {
      console.error(err);
      setError('Transaction failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Send Money</h2>
      </div>

      <form onSubmit={handlePay} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Receiver UPI ID</label>
          <input
            type="text"
            value={targetUpi}
            onChange={(e) => setTargetUpi(e.target.value)}
            placeholder="example@geminipay"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Note (Optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Dinner, Rent, etc."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Secure Pay'}
        </button>
      </form>
    </div>
  );
};

export default Transfer;
