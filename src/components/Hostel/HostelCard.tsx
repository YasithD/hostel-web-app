import { Hostel } from "@/db/schema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

type HostelCardProps = {
  hostel: Hostel;
  disabled?: boolean;
  imageUrl?: string;
  selected: boolean;
  onSelectionChange: (hostel: Hostel, checked: boolean) => void;
};

export default function HostelCard(props: HostelCardProps) {
  const { hostel, disabled, imageUrl, selected, onSelectionChange } = props;
  const cardDisabled = disabled || hostel.available_capacity === 0;

  return (
    <div
      aria-disabled={cardDisabled}
      className={cn("flex flex-col rounded-lg shadow-md select-none", cardDisabled && "opacity-50")}
    >
      <div className={cn("flex gap-2 items-center p-2 z-10 cursor-pointer", cardDisabled && "cursor-not-allowed")}>
        <div className="w-12 flex items-center justify-center">
          <Checkbox
            className="border-gray-300"
            checked={selected}
            onCheckedChange={(checked) => onSelectionChange(hostel, Boolean(checked))}
          />
        </div>
        <div className="flex-1 relative border">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR24xe7Jxjww64OIrXEIyRjUS1NyfdCLhhA2Q&s.jpg"
            alt={hostel.name}
            fill
            className="max-w-100 h-auto object-cover -z-10 opacity-70"
          />
          <div className="flex flex-col bg-white w-fit px-2 mt-8 ml-auto rounded-tl-md">
            <p className="text-sm font-bold">{hostel.name}</p>
            <div className="flex gap-1">
              <p className="text-sm text-green-400">{hostel.available_capacity}</p>
              <p className="text-sm">/</p>
              <p className="text-sm text-red-400">{hostel.total_capacity}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
