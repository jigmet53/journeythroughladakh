import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/auth.store';

const schema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const register_ = useAuthStore((s) => s.register);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const result = await register_(values.username, values.email, values.password);
    if (result.success) {
      navigate('/account/trips', { replace: true });
    } else {
      setServerError(result.message ?? 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-stone">Create an account</h1>
      <p className="mt-1 text-sm text-stone/60">Save places and build your Ladakh itinerary.</p>

      <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-1 block text-sm font-medium text-stone">Username</label>
          <input
            {...register('username')}
            className="w-full rounded-lg border border-stone/20 px-3 py-2 text-sm focus:border-accent focus:outline-none"
          />
          {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
        </div>

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
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-stone/60">
        Already have an account?{' '}
        <Link to="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
