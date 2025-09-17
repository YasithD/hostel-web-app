import { Minus, Plus } from "lucide-react";
import { Input } from "../ui/input";
import { useRef, useState } from "react";

type NumberProps = {
  max: number;
  limit: number;
  onChange: (value: number) => void;
  onLimitChange: (limit: number) => void;
};

export default function NumberInput(props: NumberProps) {
  const { max, limit, onChange, onLimitChange } = props;
  const [value, setValue] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (count: number) => {
    let newValue = count;
    /* If the value is not a number, set it to 0 */
    if (isNaN(count)) {
      newValue = 0;
    }

    const maxValue = Math.min(max, value + limit);
    if (newValue > maxValue) {
      /* If the value is greater than the max or the allowed limit, set it to the max */
      newValue = maxValue;
    } else if (newValue < 0) {
      /* If the value is less than 0, set it to 0 */
      newValue = 0;
    }

    /* Update the limit */
    onLimitChange(limit - (newValue - value));

    /* Set the value and call the onChange function */
    setValue(newValue);
    onChange(newValue);
  };

  const handleMinus = () => {
    handleChange(value - 1);
    inputRef.current?.focus();
  };

  const handlePlus = () => {
    handleChange(value + 1);
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center gap-2">
      <Minus size={20} className="cursor-pointer border rounded-full" onClick={handleMinus} />
      <Input
        ref={inputRef}
        className="w-20"
        type="number"
        value={value}
        min={0}
        max={max}
        onChange={(e) => handleChange(e.target.valueAsNumber)}
      />
      <Plus size={20} className="cursor-pointer border rounded-full" onClick={handlePlus} />
    </div>
  );
}
