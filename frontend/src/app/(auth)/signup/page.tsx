'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { isAxiosError } from 'axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useSignup } from '@/hooks/useAuth';

const schema = z
  .object({
    email: z.string().email('유효한 이메일을 입력해주세요'),
    nickname: z.string().min(2, '닉네임은 2자 이상이어야 합니다'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type FormValues = z.infer<typeof schema>;

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const signup = useSignup();

  const onSubmit = (values: FormValues) => {
    signup.mutate(
      { email: values.email, nickname: values.nickname, password: values.password },
      {
        onError: (error) => {
          if (isAxiosError(error) && error.response?.status === 409) {
            setError('email', { message: '이미 사용 중인 이메일입니다' });
          }
        },
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h1 className="text-xl font-semibold text-gray-900 mb-6">회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="이메일"
          type="email"
          placeholder="you@example.com"
          errorMessage={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="닉네임"
          placeholder="2자 이상"
          errorMessage={errors.nickname?.message}
          {...register('nickname')}
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          errorMessage={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          errorMessage={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
        <Button type="submit" fullWidth loading={signup.isPending} className="mt-2">
          회원가입
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-orange-500 font-medium hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
