'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useLogin } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const login = useLogin();

  const onSubmit = (values: FormValues) => {
    login.mutate(values, {
      onError: (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 401 || status === 400 || status === 422) {
            setError('password', { message: '이메일 또는 비밀번호가 올바르지 않습니다' });
          }
        }
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          placeholder="you@example.com"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth loading={login.isPending} className="mt-2">
          로그인
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/signup" className="text-orange-500 font-medium hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
