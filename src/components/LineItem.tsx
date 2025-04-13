import React from "react";
import { LineItem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface LineItemProps {
  item: LineItem;
  onUpdate: (field: keyof LineItem, value: string | number) => void;
  onRemove: () => void;
}

const LineItemComponent: React.FC<LineItemProps> = ({ item, onUpdate, onRemove }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onUpdate(name as keyof LineItem, value);
  };

  // Calculate the line item total
  const total = item.quantity * item.rate;

  return (
    <tr className="border-b">
      <td className="p-2">
        <Input
          type="text"
          name="description"
          placeholder="Item name"
          value={item.description}
          onChange={handleChange}
          className="w-full border-0 focus:ring-0 p-1"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          name="quantity"
          value={item.quantity}
          min="1"
          onChange={handleChange}
          className="w-full border-0 focus:ring-0 p-1 text-right font-mono"
        />
      </td>
      <td className="p-2">
        <div className="flex items-center">
          <span className="text-slate-500 mr-1">$</span>
          <Input
            type="number"
            name="rate"
            value={item.rate}
            min="0"
            step="0.01"
            onChange={handleChange}
            className="w-full border-0 focus:ring-0 p-1 text-right font-mono"
          />
        </div>
      </td>
      <td className="p-2 font-mono text-right">{formatCurrency(total)}</td>
      <td className="p-2 text-center">
        <Button
          onClick={onRemove}
          size="icon"
          variant="ghost"
          className="text-red-500 hover:text-red-700 h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default LineItemComponent;
