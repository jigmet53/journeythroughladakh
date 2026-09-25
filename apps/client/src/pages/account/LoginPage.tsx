import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../stores/auth.store';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Field, FormError, PasswordInput, inputClass, primaryButton } from '../../components/ui/forms';
import { Seo } from '../../components/seo/Seo';

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
    <AuthLayout
      photo="hero-sunset-indus"
      panelTitle={
        <>
          Pick up where you left <em>off.</em>
        </>
      }
      panelText="Your saved itineraries are waiting — edit a day, share a route or start a new one."
      title="Welcome back"
      subtitle="Log in to see your saved trips."
    >
      <Seo title="Log in" description="Log in to your Journey Through Ladakh account." path="/login" />
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)} noValidate>
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
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            {...register('password')}
          />
        </Field>

        {serverError && <FormError>{serverError}</FormError>}

        <button type="submit" disabled={isSubmitting} className={`${primaryButton} w-full py-3.5`}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone/60">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-accent hover:underline">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
