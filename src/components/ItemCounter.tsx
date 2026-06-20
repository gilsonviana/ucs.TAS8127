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
    <div className="flex items-center gap-2">
      <IconButton
        variant="button"
        label="Decrease quantity"
        onClick={onDecrement}
        disabled={value <= min}
      >
        <Minus size={14} />
      </IconButton>
      <span className="w-8 text-center text-body font-medium text-dark" aria-live="polite">
        {value}
      </span>
      <IconButton
        variant="button"
        label="Increase quantity"
        onClick={onIncrement}
        disabled={value >= max}
      >
        <Plus size={14} />
      </IconButton>
    </div>
  );
}
