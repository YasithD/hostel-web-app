import { cn } from "@/lib/utils";

type StatusProps = {
  status: "pending" | "approved" | "rejected";
};

export default function Status({ status }: StatusProps) {
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-md text-center text-background",
        status === "pending" && "bg-yellow-500",
        status === "approved" && "bg-green-500",
        status === "rejected" && "bg-red-500"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
