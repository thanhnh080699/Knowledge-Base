'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useHydrated } from '@/hooks/use-hydrated';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAuth, isAuthenticated } = useAuthStore();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push('/');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) return null;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      
      const { user, token } = response.data.data;
      const accessToken = token?.token || token?.value || token;
      setAuth(user, accessToken); 

      if (!user) {
         const userResponse = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
         });
         setAuth(userResponse.data.data, accessToken);
      }

      toast.success('Đăng nhập thành công');
      router.push('/');
    } catch (err: unknown) {
      console.error(err);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--app-bg)]">
      {/* Left side - Image Placeholder */}
      <div className="hidden w-1/2 lg:block relative bg-slate-900 overflow-hidden">
        {/* Placeholder gradient / pattern until image is added */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        <div className="absolute inset-0 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
              ThanhNh CMS
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Multi-platform content management system. Manage your posts, projects, media, and contact information in one place.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-[var(--app-muted)]">
              Please enter your credentials to access the system
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md border border-[var(--app-danger-soft-border)] bg-[var(--app-danger-soft-bg)] p-4 text-sm text-[var(--app-danger-soft-fg)]">
                {error}
              </div>
            )}
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[var(--app-muted-strong)]">Email address</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10 h-12 text-base"
                    placeholder="admin@thanhnh.id.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[var(--app-muted-strong)]">Password</Label>
                  <a href="#" className="text-sm font-medium text-[var(--app-muted)] hover:text-[var(--foreground)] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10 h-12 text-base"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border border-[var(--app-border-strong)] bg-[var(--app-input-bg)] text-[var(--foreground)] focus:ring-[var(--app-ring)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--app-muted-strong)]">
                Remember me
              </label>
            </div>

            <Button type="submit" className="w-full h-12 text-base" isLoading={isLoading}>
              Sign in
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} thanhnh.id.vn. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
