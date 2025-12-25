
import React, { useState, useEffect } from 'react';
import { ref, get, update, onValue } from 'firebase/database';
import { db } from '../firebase';
import { UserProfile, Transaction } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalBalance: 0 });

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.values(data) as UserProfile[];
        setUsers(userList);
        const totalBal = userList.reduce((acc, u) => acc + u.balance, 0);
        setStats({ totalUsers: userList.length, totalBalance: totalBal });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl font-black italic tracking-tighter">ADMIN CORE</h2>
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">System Monitor Active</p>
        </div>
        <button onClick={onLogout} className="bg-rose-500 hover:bg-rose-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors">Logout</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Users</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">{stats.totalUsers}</h3>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Total Deposits</p>
          <h3 className="text-2xl font-black text-indigo-600 mt-1">₹{stats.totalBalance.toLocaleString()}</h3>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 mb-4 px-1">User Management</h3>
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u.uid} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full border border-slate-100" />
                <div>
                  <p className="text-sm font-bold text-slate-800 leading-none">{u.displayName}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{u.upiId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-800">₹{u.balance.toFixed(2)}</p>
                <p className="text-[10px] font-bold text-green-600 uppercase">Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-indigo-900 p-6 rounded-3xl text-white">
        <h4 className="font-bold text-sm mb-2">Global System Settings</h4>
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-indigo-300">Daily Interest Rate</span>
            <span className="font-bold">0.01%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-indigo-300">UPI API Status</span>
            <span className="text-emerald-400 font-bold">Operational</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-indigo-300">Gemini LLM Sync</span>
            <span className="text-emerald-400 font-bold">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
