'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (isRegister ? 'Registration failed' : 'Login failed'));
        return;
      }

      loginUser(data.user, data.token);
      router.push('/');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-duo-surface px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🦉</div>
          <h1 className="text-3xl font-bold text-duo-green">AI Learn</h1>
          <p className="text-duo-text-secondary mt-2">
            {isRegister ? 'Start your AI learning journey!' : 'Learn AI. Have fun. Level up.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex mb-6 bg-duo-surface rounded-xl p-1">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                !isRegister ? 'bg-white text-duo-text shadow-sm' : 'text-duo-text-secondary'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                isRegister ? 'bg-white text-duo-text shadow-sm' : 'text-duo-text-secondary'
              }`}
            >
              Sign up
            </button>
          </div>

          {error && (
            <div className="bg-duo-red/10 border border-duo-red/30 text-duo-red rounded-xl px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-duo-text mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-duo-border bg-duo-surface
                           focus:outline-none focus:border-duo-green focus:ring-2 focus:ring-duo-green/20
                           text-duo-text placeholder-duo-text-secondary transition-all"
                placeholder={isRegister ? 'Choose a username' : 'Enter your username'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-duo-text mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-duo-border bg-duo-surface
                           focus:outline-none focus:border-duo-green focus:ring-2 focus:ring-duo-green/20
                           text-duo-text placeholder-duo-text-secondary transition-all"
                placeholder={isRegister ? 'Create a password' : 'Enter your password'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-duo-green text-white font-bold text-lg
                         hover:bg-duo-green-dark transition-all shadow-lg shadow-duo-green/30
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (isRegister ? 'Creating account...' : 'Logging in...')
                : (isRegister ? 'Create account' : 'Log in')}
            </button>
          </form>

          <p className="text-center text-sm text-duo-text-secondary mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={toggleMode}
              className="text-duo-green font-semibold hover:underline"
            >
              {isRegister ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
