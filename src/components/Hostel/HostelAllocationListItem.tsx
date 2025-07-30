import { Hostel } from "@/db/schema";
import { SendHorizonal, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../ui/button";

type HostelAllocationListItemProps = {
  hostel: Hostel;
  currentAllocations: number;
  maxAllocations: number;
  onAllocationsChange: (count: number) => void;
  onClick: () => void;
  onDelete: () => void;
};

export default function HostelAllocationListItem(props: HostelAllocationListItemProps) {
  const { hostel, currentAllocations, maxAllocations, onAllocationsChange, onClick, onDelete } = props;

  const schema = yup.object({
    allocations: yup.number().min(0).max(Math.min(maxAllocations, hostel.available_capacity)).required(),
  });

  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: {
      allocations: currentAllocations,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleDelete = () => {
    onDelete();
  };

  const handleAllocationsChange = (data: FormData) => {
    onAllocationsChange(data.allocations);
  };

  return (
    <div className="flex gap-2 items-center rounded-md shadow-md p-4 cursor-pointer" onClick={onClick}>
      <p className="text-heading-2">{hostel.name}</p>
      <p className="text-sm text-bold text-primary">{`(${hostel.type.charAt(0).toUpperCase()})`}</p>
      <Input type="number" className="w-16 ml-auto" {...register("allocations")} />
      <p className="text-paragraph">from</p>
      <p className="text-sm text-green-500">{hostel.available_capacity}</p>
      <div className="ml-4 flex">
        <Button
          variant="ghost"
          size="icon"
          disabled={!!errors.allocations}
          onClick={handleSubmit(handleAllocationsChange)}
        >
          <SendHorizonal size={20} className="text-primary" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <Trash2 size={20} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
}
