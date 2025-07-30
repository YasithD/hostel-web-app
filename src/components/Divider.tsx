import { cn } from "@/lib/utils";

type DividerProps = {
  className?: string;
};

export default function Divider(props: DividerProps) {
  const { className } = props;

  return <div className={cn("w-full h-[1px] bg-gray-200", className)} />;
}
