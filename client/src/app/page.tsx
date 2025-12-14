'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-50 rounded-b-[3rem] -z-10" />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-2 tracking-tight">
          인플커넥트
        </h1>
        <p className="text-gray-500 font-medium">
          사장님과 인플루언서의<br />
          가장 쉬운 연결
        </p>
      </div>

      <div className="w-full max-w-[280px] aspect-square bg-white rounded-3xl shadow-xl flex items-center justify-center mb-12 border border-gray-100">
        <span className="text-4xl">🤝</span>
      </div>

      <div className="w-full max-w-xs space-y-3">
        <Button
          fullWidth
          size="lg"
          onClick={() => router.push('/login')}
          className="shadow-lg shadow-blue-600/20"
        >
          시작하기
        </Button>
        <Button
          fullWidth
          variant="secondary"
          size="lg"
          onClick={() => router.push('/signup')}
        >
          회원가입
        </Button>
      </div>

      <p className="mt-8 text-xs text-center text-gray-400">
        © 2024 InflConnect. All rights reserved.
      </p>
    </div>
  );
}
