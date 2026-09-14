import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/auth.store';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await login(values.email, values.password);
    if (result.success) {
      const redirectTo = (location.state as { from?: string })?.from ?? '/account/trips';
      navigate(redirectTo, { replace: true });
    } else {
      setServerError(result.message ?? 'Login failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-stone">Log in</h1>
      <p className="mt-1 text-sm text-stone/60">Access your saved places and trips.</p>

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Email</label>
          <input
            type="email"
            {...register('email')}
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Password</label>
          <input
            type="password"
            {...register('password')}
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-stone px-6 py-2.5 text-sm font-medium text-snow hover:bg-accent disabled:opacity-60"
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-stone/60">
        Don't have an account?{' '}
        <Link to="/register" className="text-accent hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
