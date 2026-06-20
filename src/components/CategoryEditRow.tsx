"use client";

import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import IconButton from "./IconButton";

interface CategoryEditRowProps {
  id: number;
  name: string;
  onSave: (id: number, name: string) => void;
  onDelete: (id: number) => void;
}

export default function CategoryEditRow({
  id,
  name,
  onSave,
  onDelete,
}: CategoryEditRowProps) {
  const t = useTranslations("admin");
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);

  function handleSave() {
    if (value.trim()) {
      onSave(id, value.trim());
      setEditing(false);
    }
  }

  function handleCancel() {
    setValue(name);
    setEditing(false);
  }

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") handleCancel();
            }}
            autoFocus
            className="flex-1 border border-primary rounded-md px-2 py-1 text-sm-body text-dark focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <IconButton variant="clean" label={t("save")} onClick={handleSave} className="text-success">
            <Check size={16} />
          </IconButton>
          <IconButton variant="clean" label={t("cancel")} onClick={handleCancel}>
            <X size={16} />
          </IconButton>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm-body text-dark">{name}</span>
          <IconButton variant="clean" label={t("edit")} onClick={() => setEditing(true)}>
            <Pencil size={16} />
          </IconButton>
          <IconButton variant="clean" label={t("delete")} onClick={() => onDelete(id)} className="text-error">
            <Trash2 size={16} />
          </IconButton>
        </>
      )}
    </div>
  );
}
