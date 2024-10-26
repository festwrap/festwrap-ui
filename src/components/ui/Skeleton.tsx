import { cn } from "@/src/lib/utils"

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
  rounded?: string
}

const Skeleton = ({
  className = "",
  width = "w-full",
  height = "h-4",
  rounded = "rounded-md",
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        "bg-gray-200 animate-pulse",
        className,
        width,
        height,
        rounded
      )}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Skeleton
