
import React from 'react';
import { Transaction } from '../types';

interface HistoryProps {
  transactions: Transaction[];
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800">Passbook</h2>
        <p className="text-slate-400 text-xs font-medium mt-1">Detailed transaction logs</p>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              tx.type === 'CREDIT' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'
            }`}>
              {tx.type === 'CREDIT' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{tx.note || (tx.type === 'CREDIT' ? 'Received' : 'Paid')}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {tx.type === 'CREDIT' ? `From: ${tx.fromUpiId}` : `To: ${tx.toUpiId}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(tx.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{tx.status}</span>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="flex flex-col items-center py-20 text-slate-300">
             <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
             <p className="font-bold">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
