"use client";

import { Minus, Plus } from "lucide-react";
import IconButton from "./IconButton";

interface ItemCounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

export default function ItemCounter({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
}: ItemCounterProps) {
  return (
    <div className="flex items-center gap-1">
      <IconButton
        variant="gray"
        label="Decrease quantity"
        onClick={onDecrement}
        disabled={value <= min}
      >
        <Minus size={12} />
      </IconButton>
      <span className="w-6 text-center text-xs-body font-medium text-dark" aria-live="polite">
        {value}
      </span>
      <IconButton
        variant="gray"
        label="Increase quantity"
        onClick={onIncrement}
        disabled={value >= max}
      >
        <Plus size={12} />
      </IconButton>
    </div>
  );
}
