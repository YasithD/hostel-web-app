import { cn } from "@/lib/utils";

export const ProgressRing = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => {
  const circumference = 2 * Math.PI * 80;
  const strokeDasharray = 0.75 * circumference;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className={cn("w-10 h-10 stroke-primary animate-spin", className)}
      {...props}
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        strokeWidth="20"
        strokeDasharray={`${strokeDasharray} ${circumference - strokeDasharray}`}
        strokeLinecap="round"
      />
    </svg>
  );
};
