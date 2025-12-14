'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    bucket?: string;
}

export function ImageUploader({ value, onChange, bucket = 'campaign-thumbnails' }: ImageUploaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(fileName);

            onChange(publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError('업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleRemove = () => {
        onChange('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileSelect}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
            />

            {value ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img
                        src={value}
                        alt="Uploaded thumbnail"
                        className="w-full h-48 object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    disabled={isUploading}
                    className="w-full h-48 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? (
                        <div className="text-gray-400">업로드 중...</div>
                    ) : (
                        <>
                            <div className="text-4xl text-gray-300">🖼️</div>
                            <div className="text-sm text-gray-500">
                                <span className="text-blue-500 font-medium">클릭</span> 하거나{' '}
                                <span className="text-blue-500 font-medium">드래그/드롭</span> 해주세요
                            </div>
                            <div className="text-xs text-gray-400">
                                5MB 이하의 JPEG, PNG 파일
                            </div>
                        </>
                    )}
                </button>
            )}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
