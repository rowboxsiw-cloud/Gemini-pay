
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ScanProps {
  user: UserProfile;
  onBack: () => void;
}

const Scan: React.FC<ScanProps> = ({ user, onBack }) => {
  const [scanned, setScanned] = useState(false);

  // Simplified UI as full QR scanning library usually requires complex setup
  // We simulate the scanning process for the demo
  const simulateScan = () => {
    setScanned(true);
    setTimeout(() => {
      alert("QR Scanner initialized. In a real device, this would open the camera.");
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
      <div className="relative w-64 h-64 border-2 border-indigo-600 rounded-3xl overflow-hidden flex items-center justify-center bg-slate-900 group">
        <div className="absolute inset-4 border-2 border-white/20 border-dashed rounded-2xl"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-bounce"></div>
        <svg className="w-16 h-16 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Scan QR Code</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-[200px]">Align the QR code within the frame to scan and pay instantly.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Your QR Code</p>
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.upiId}`} 
          alt="My UPI QR" 
          className="w-32 h-32"
        />
        <p className="text-xs font-bold text-slate-700 mt-3">{user.upiId}</p>
      </div>
      
      <button 
        onClick={simulateScan}
        className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-200"
      >
        Initialize Camera
      </button>
    </div>
  );
};

export default Scan;
