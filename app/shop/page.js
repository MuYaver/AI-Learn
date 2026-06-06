'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import TopBar, { BottomNav } from '@/components/layout/Navbar';

const itemEmojis = {
  streak_freeze: '❄️',
  hearts_refill: '❤️',
  xp_boost: '⚡',
  cosmetic: '✨',
};

export default function ShopPage() {
  const { user, loading, refreshUser } = useUser();
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [buying, setBuying] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
    if (user) {
      Promise.all([
        fetch('/api/shop/items', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((r) => r.json()),
        fetch('/api/shop/inventory', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then((r) => r.json()),
      ])
        .then(([itemsData, invData]) => {
          setItems(itemsData.items || []);
          setInventory(invData.inventory || []);
        })
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  const handleBuy = async (item) => {
    setBuying(item.id);
    setMessage(null);
    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Purchase failed' });
        return;
      }

      setMessage({ type: 'success', text: `Purchased ${item.name}!` });
      await refreshUser();

      const invRes = await fetch('/api/shop/inventory', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const invData = await invRes.json();
      setInventory(invData.inventory || []);
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong' });
    } finally {
      setBuying(null);
    }
  };

  const getInvCount = (itemId) => {
    const found = inventory.find((i) => i.item_id === itemId);
    return found ? found.quantity : 0;
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-duo-surface">
        <div className="text-5xl animate-bounce">🛍️</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-duo-surface pb-20">
      <TopBar />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-duo-text">Shop</h1>
            <p className="text-duo-text-secondary text-sm">Spend your hard-earned gems</p>
          </div>
          <div className="bg-duo-blue/10 text-duo-blue px-4 py-2 rounded-xl font-bold flex items-center gap-2">
            <span className="text-xl">💎</span>
            {user.gems || 0} gems
          </div>
        </div>

        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl px-4 py-3 mb-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-duo-green/10 text-duo-green border border-duo-green/20'
                : 'bg-duo-red/10 text-duo-red border border-duo-red/20'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => {
            const invCount = getInvCount(item.id);
            const canAfford = (user.gems || 0) >= item.cost_gems;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-duo-border p-5
                           hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-duo-surface flex items-center justify-center text-2xl flex-shrink-0">
                    {itemEmojis[item.type] || '🎁'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-duo-text">{item.name}</h3>
                    <p className="text-xs text-duo-text-secondary mt-0.5">{item.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-duo-text-secondary">
                    {invCount > 0 && (
                      <span className="text-duo-green font-medium">Owned: {invCount}</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-duo-blue">💎 {item.cost_gems}</span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={!canAfford || buying === item.id}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        canAfford
                          ? 'bg-duo-green text-white hover:bg-duo-green-dark shadow-md shadow-duo-green/20'
                          : 'bg-duo-snow text-duo-text-secondary cursor-not-allowed'
                      } disabled:opacity-50`}
                    >
                      {buying === item.id ? '...' : canAfford ? 'Buy' : 'Not enough'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
