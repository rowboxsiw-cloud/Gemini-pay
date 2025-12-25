
import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';
import { getSmartFinancialAdvice } from '../geminiService';

interface DashboardProps {
  user: UserProfile;
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions }) => {
  const [advice, setAdvice] = useState<string>('Analyzing your finances...');

  useEffect(() => {
    const summary = transactions.slice(0, 3).map(t => `${t.type} of ₹${t.amount}`).join(', ');
    getSmartFinancialAdvice(summary, user.balance).then(setAdvice);
  }, [transactions, user.balance]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="relative">
          <p className="text-indigo-100 text-sm font-medium">Available Balance</p>
          <h2 className="text-4xl font-bold mt-1">₹ {user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
          <p className="text-indigo-100 text-[10px] mt-4 opacity-80 uppercase tracking-widest">{user.upiId}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-indigo-50 flex items-start gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">Gemini Insight</h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed italic">{advice}</p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Recent Activity</h3>
          <button className="text-xs font-semibold text-indigo-600">View All</button>
        </div>
        <div className="space-y-3">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {tx.type === 'CREDIT' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tx.note || (tx.type === 'CREDIT' ? 'Received' : 'Sent')}</p>
                  <p className="text-[10px] text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <p className={`text-sm font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`}>
                {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount}
              </p>
            </div>
          ))}
          {transactions.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-8">No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
