
import React, { useState } from 'react';
import { signInWithGoogle } from '../firebase';

interface LoginProps {
  onAdminLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onAdminLogin }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'root' && password === '117393993987') {
      onAdminLogin();
    } else {
      alert('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-6 max-w-md mx-auto border-x shadow-xl">
      <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-indigo-200 mb-8 rotate-3">G</div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">GeminiPay</h1>
        <p className="text-slate-500 mt-2 font-medium">The future of Indian payments</p>
      </div>

      {isAdminMode ? (
        <form onSubmit={handleAdminSubmit} className="w-full space-y-4">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Portal</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-indigo-700 active:scale-[0.98] transition-all">Login to Dashboard</button>
            <button 
              type="button" 
              onClick={() => setIsAdminMode(false)}
              className="w-full text-slate-400 text-sm font-semibold hover:text-slate-600 py-2"
            >
              Back to User Login
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full space-y-4">
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-[1px] bg-slate-200"></div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
            <div className="flex-1 h-[1px] bg-slate-200"></div>
          </div>

          <button 
            onClick={() => setIsAdminMode(true)}
            className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-900 active:scale-[0.98] transition-all"
          >
            Admin Access
          </button>
          
          <div className="mt-8 bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center gap-3">
            <div className="bg-green-500 text-white p-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
            </div>
            <p className="text-green-800 text-xs font-bold">New users get ₹30 Welcome Bonus!</p>
          </div>
        </div>
      )}

      <footer className="mt-20 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
        Powered by Gemini Intelligence
      </footer>
    </div>
  );
};

export default Login;
