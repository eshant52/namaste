import { Skeleton } from "@/components/ui/skeleton";

type ContactRowSkeletonListProps = {
  count: number;
};

export const ContactRowSkeletonList = ({
  count,
}: ContactRowSkeletonListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg border p-3"
        >
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};
