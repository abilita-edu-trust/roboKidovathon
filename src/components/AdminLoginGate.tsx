import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, Lock, LogOut } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Roles that may open the admin portal. City admins only get their own cities' rows
// (the admin RPCs enforce this, migration 0014).
const ADMIN_ROLES = ['admin', 'super_admin', 'city_admin'];

const inputCls =
  'w-full px-3 py-2.5 text-sm border border-slate-300 bg-white focus:outline-none focus:border-[#006AA7] focus:ring-1 focus:ring-[#006AA7]';
const labelCls = 'block text-xs font-headline font-bold uppercase tracking-wider text-slate-700 mb-1.5';

type GateState = 'loading' | 'signed-out' | 'forbidden' | 'allowed';

/**
 * Sign-in wall for the admin portal. Uses the same accounts as the iniac.se dashboard;
 * only admin, super_admin and city_admin roles get through.
 */
export const AdminLoginGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GateState>('loading');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [signedInAs, setSignedInAs] = useState('');

  const checkRole = async (userId: string | undefined, userEmail: string | undefined) => {
    if (!userId) {
      setState('signed-out');
      return;
    }
    setSignedInAs(userEmail ?? '');
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId);
    const roles: string[] = (data ?? []).map((r: { role: string }) => r.role);
    setState(roles.some((r) => ADMIN_ROLES.includes(r)) ? 'allowed' : 'forbidden');
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setState('signed-out');
      return;
    }
    supabase.auth.getSession().then(({ data }: { data: { session: { user: { id: string; email?: string } } | null } }) =>
      checkRole(data.session?.user.id, data.session?.user.email)
    );
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: { id: string; email?: string } } | null) => {
        checkRole(session?.user.id, session?.user.email);
      }
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) setError('Wrong email or password.');
    else setPassword('');
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setState('signed-out');
  };

  if (state === 'allowed') {
    return (
      <>
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-[#0A1930] text-white text-[11px] font-mono-code px-3 py-2 shadow-lg">
          <span className="hidden sm:inline">{signedInAs}</span>
          <button type="button" onClick={signOut} className="inline-flex items-center gap-1 text-[#FFCD00] hover:underline uppercase font-bold">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0A1930] pt-32 pb-20 px-4">
      <div className="max-w-sm mx-auto bg-white border border-slate-200 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 bg-[#0A1930] text-[#FFCD00] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </span>
          <div>
            <h1 className="font-headline font-black text-xl uppercase tracking-tight">Admin Portal</h1>
            <p className="text-xs text-slate-500">Sign in with your iniac.se admin account.</p>
          </div>
        </div>

        {state === 'loading' && <p className="text-xs font-mono-code text-slate-500">Checking session…</p>}

        {state === 'forbidden' && (
          <div className="space-y-3">
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{signedInAs} does not have admin access.</span>
            </div>
            <button type="button" onClick={signOut} className="text-xs font-mono-code font-bold uppercase text-[#006AA7] hover:underline">
              Sign in with another account
            </button>
          </div>
        )}

        {state === 'signed-out' && (
          <form onSubmit={signIn} className="space-y-4">
            <div>
              <label className={labelCls} htmlFor="admin-email">Email</label>
              <input id="admin-email" type="email" required autoComplete="username" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <button type="submit" disabled={busy || !isSupabaseConfigured} className="w-full btn-pill-lime py-3 text-xs font-black flex items-center justify-center gap-2 disabled:opacity-60">
              <span>{busy ? 'Signing in…' : 'Sign in'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
