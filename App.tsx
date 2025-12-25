
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, get, set, update, onValue, push } from 'firebase/database';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { UserProfile, Transaction, Page } from './types';
import Dashboard from './components/Dashboard';
import Transfer from './components/Transfer';
import Scan from './components/Scan';
import History from './components/History';
import Profile from './components/Profile';
import AdminPanel from './components/AdminPanel';
import AIChat from './components/AIChat';
import Login from './components/Login';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(Page.DASHBOARD);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  const fetchUserData = useCallback(async (uid: string) => {
    const userRef = ref(db, `users/${uid}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val() as UserProfile;
      // Calculate Interest since last visit (Daily 0.01% for demo)
      const now = Date.now();
      const diffMs = now - userData.lastInterestUpdate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 1) {
        const interestRate = 0.0001; // 0.01% per day
        const interest = userData.balance * interestRate * diffDays;
        const newBalance = userData.balance + interest;
        
        await update(userRef, {
          balance: newBalance,
          lastInterestUpdate: now
        });

        if (interest > 0) {
          // Record interest transaction
          const transRef = ref(db, `transactions/${uid}`);
          await push(transRef, {
            type: 'CREDIT',
            amount: interest,
            fromUpiId: 'GEMINI_BANK',
            toUpiId: userData.upiId,
            timestamp: now,
            note: 'Daily Interest Payout',
            status: 'SUCCESS'
          });
        }
        userData.balance = newBalance;
      }
      setUser(userData);
    } else {
      // First time user: Create profile and give bonus
      const newUser: UserProfile = {
        uid,
        displayName: auth.currentUser?.displayName || 'User',
        email: auth.currentUser?.email || '',
        photoURL: auth.currentUser?.photoURL || 'https://picsum.photos/200',
        upiId: `${(auth.currentUser?.email || 'user').split('@')[0]}@geminipay`,
        balance: 30, // ₹30 Welcome Bonus
        lastInterestUpdate: Date.now(),
        createdAt: Date.now(),
      };
      await set(userRef, newUser);
      
      // Record bonus transaction
      const transRef = ref(db, `transactions/${uid}`);
      await push(transRef, {
        type: 'CREDIT',
        amount: 30,
        fromUpiId: 'GEMINI_BANK',
        toUpiId: newUser.upiId,
        timestamp: Date.now(),
        note: 'Welcome Bonus',
        status: 'SUCCESS'
      });
      setUser(newUser);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        fetchUserData(firebaseUser.uid);
        
        // Listen for transactions
        const transRef = ref(db, `transactions/${firebaseUser.uid}`);
        onValue(transRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const list = Object.entries(data).map(([id, val]: [string, any]) => ({
              id,
              ...val
            })).sort((a, b) => b.timestamp - a.timestamp);
            setTransactions(list);
          }
        });
      } else {
        setUser(null);
        setTransactions([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user && !adminLoggedIn) {
    return <Login onAdminLogin={() => setAdminLoggedIn(true)} />;
  }

  const renderPage = () => {
    if (adminLoggedIn) return <AdminPanel onLogout={() => setAdminLoggedIn(false)} />;
    
    switch (currentPage) {
      case Page.DASHBOARD: return <Dashboard user={user!} transactions={transactions} />;
      case Page.TRANSFER: return <Transfer user={user!} onBack={() => setCurrentPage(Page.DASHBOARD)} />;
      case Page.SCAN: return <Scan user={user!} onBack={() => setCurrentPage(Page.DASHBOARD)} />;
      case Page.HISTORY: return <History transactions={transactions} />;
      case Page.PROFILE: return <Profile user={user!} onLogout={logout} />;
      case Page.AI_CHAT: return <AIChat user={user!} />;
      default: return <Dashboard user={user!} transactions={transactions} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 max-w-md mx-auto bg-slate-50 relative shadow-xl border-x">
      <header className="sticky top-0 z-50 glass p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <h1 className="font-bold text-slate-800 tracking-tight">GeminiPay</h1>
        </div>
        <button 
          onClick={() => setCurrentPage(Page.AI_CHAT)}
          className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
        </button>
      </header>

      <main className="p-4">
        {renderPage()}
      </main>

      {!adminLoggedIn && (
        <Navigation current={currentPage} setPage={setCurrentPage} />
      )}
    </div>
  );
};

export default App;
