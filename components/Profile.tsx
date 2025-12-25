
import React from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
        <div className="relative">
          <img src={user.photoURL} alt={user.displayName} className="w-24 h-24 rounded-[2rem] border-4 border-indigo-50 shadow-lg" />
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-xl border-2 border-white">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
        </div>
        <h2 className="mt-4 text-xl font-black text-slate-800 tracking-tight">{user.displayName}</h2>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{user.upiId}</p>
        
        <div className="mt-8 w-full bg-slate-50 p-4 rounded-2xl flex justify-around">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Member Since</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{new Date(user.createdAt).getFullYear()}</p>
          </div>
          <div className="w-[1px] bg-slate-200"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">KYC Status</p>
            <p className="text-sm font-bold text-green-600 mt-1 uppercase">Verified</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
            </div>
            <span className="text-sm font-bold text-slate-700">Security & Limits</span>
          </div>
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="text-sm font-bold text-slate-700">Bank Accounts</span>
          </div>
          <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-5 hover:bg-rose-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-rose-50 p-2 rounded-xl text-rose-600 group-hover:bg-rose-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <span className="text-sm font-bold text-rose-600">Sign Out</span>
          </div>
        </button>
      </div>
      
      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest pb-4">Version 2.5.0-Gemini</p>
    </div>
  );
};

export default Profile;
