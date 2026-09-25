import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/auth.store';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Field, FormError, PasswordInput, inputClass, primaryButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';

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
    <AuthLayout
      photo="spangmik-sunset"
      panelTitle={
        <>
          Your Ladakh story <em>starts here.</em>
        </>
      }
      panelText="Create a free account to build day-by-day itineraries, edit them any time and share a link with your travel companions."
      title="Create an account"
      subtitle="Save places and build your Ladakh itinerary."
    >
      <Seo title="Create an account" description="Create a Journey Through Ladakh account to save trips." path="/register" />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Username" htmlFor="username" error={errors.username?.message}>
          <input
            id="username"
            autoComplete="username"
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            {...register('username')}
            className={inputClass}
          />
        </Field>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
            className={inputClass}
          />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message} hint="At least 8 characters.">
          <PasswordInput
            id="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </Field>

        {serverError && <FormError>{serverError}</FormError>}

        <button type="submit" disabled={isSubmitting} className={`${primaryButton} w-full py-3.5`}>
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
