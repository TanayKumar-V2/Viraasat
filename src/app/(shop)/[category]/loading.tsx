import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-6 w-24 hidden sm:block" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="group relative border rounded-xl overflow-hidden bg-card">
                        <Skeleton className="w-full aspect-[4/5]" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
