"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import CategoryEditRow from "@/components/CategoryEditRow";
import Button from "@/components/Button";
import TextInput from "@/components/TextInput";

interface Category { id: number; name: string; }

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const t = useTranslations("admin");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = { Authorization: `Bearer ${token}` };

  function load() {
    axios.get<Category[]>("/api/admin/categories", { headers }).then((r) => setCategories(r.data));
  }

  useEffect(() => { load(); }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd() {
    if (!newName.trim()) return;
    setAdding(true); setError(null);
    try {
      await axios.post("/api/admin/categories", { name: newName.trim() }, { headers });
      setNewName(""); load();
    } catch {
      setError(t("couldNotAddCategory"));
    } finally {
      setAdding(false);
    }
  }

  async function handleSave(id: number, name: string) {
    await axios.patch(`/api/admin/categories/${id}`, { name }, { headers });
    load();
  }

  async function handleDelete(id: number) {
    if (!confirm(t("deleteCategory"))) return;
    await axios.delete(`/api/admin/categories/${id}`, { headers });
    load();
  }

  return (
    <main className="p-8">
      <h1 className="text-page-title font-normal text-white mb-6">{t("categories")}</h1>

      <div className="flex gap-3 mb-8 max-w-md">
        <TextInput
          placeholder={t("newCategoryPlaceholder")}
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="flex-1"
        />
        <Button variant="primary" onClick={handleAdd} disabled={adding}>{t("add")}</Button>
      </div>

      {error && <p className="text-error text-sm-body mb-4" role="alert">{error}</p>}

      <div className="flex flex-col gap-2 max-w-lg">
        {categories.map((cat) => (
          <CategoryEditRow key={cat.id} id={cat.id} name={cat.name} onSave={handleSave} onDelete={handleDelete} />
        ))}
        {categories.length === 0 && <p className="text-gray-400 text-sm-body">{t("noCategories")}</p>}
      </div>
    </main>
  );
}
