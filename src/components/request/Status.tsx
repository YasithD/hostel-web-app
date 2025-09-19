import { cn } from "@/lib/utils";

type StatusProps = {
  status: "pending" | "approved" | "rejected";
};

export default function Status({ status }: StatusProps) {
  return (
    <div
      className={cn(
        "px-2 py-1 rounded-md text-center text-foreground-muted",
        status === "pending" && "bg-warning",
        status === "approved" && "bg-success",
        status === "rejected" && "bg-danger"
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
