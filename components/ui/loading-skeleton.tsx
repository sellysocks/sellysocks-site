import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-[#262833]", className)} {...props} />
}

export function ItemCardSkeleton() {
  return (
    <div className="bg-[#15161C] border-[#262833] border rounded-xl overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-3 w-20" />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-7 w-12" />
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Skeleton className="h-48 w-full rounded-lg" />
        <div className="px-4">
          <div className="relative -mt-16">
            <div className="flex items-end gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <div className="flex-1 pb-2 space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-2">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
        </div>
      </div>
    </div>
  )
}
