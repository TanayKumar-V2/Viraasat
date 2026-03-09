import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProduct() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Image Skeleton */}
                <Skeleton className="w-full aspect-[4/5] rounded-xl" />

                {/* Details Skeleton */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-2/3" />
                        <Skeleton className="h-6 w-1/4" />
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-5 w-1/3" />
                        <div className="flex gap-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-10 w-16" />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Skeleton className="h-5 w-1/3" />
                        <div className="flex gap-2">
                            {[1, 2].map((i) => (
                                <Skeleton key={i} className="h-10 w-24" />
                            ))}
                        </div>
                    </div>

                    <Skeleton className="h-14 w-full" />
                    
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
