import { SkeletonCard } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 p-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
