import type { HTMLAttributes } from 'react';
import { cn } from '@/src/lib/utils';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse bg-slate-200 rounded-2xl', className)}
      aria-hidden
      {...props}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex flex-col h-full min-h-[420px]">
      <div className="flex justify-end mb-6">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-48 w-full mb-6" />
      <Skeleton className="h-6 w-4/5 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-8 flex-grow" />
      <Skeleton className="h-14 w-full mt-auto" />
    </div>
  );
}
