"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import ProductRow from "@/components/ProductRow";
import ProductEditForm, { type ProductFormValues } from "@/components/ProductEditForm";
import Button from "@/components/Button";
import { X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number | null;
  stock: number;
}

interface Category { id: number; name: string; }

export default function AdminProductsPage() {
  const { token } = useAuth();
  const t = useTranslations("admin");
  const headers = { Authorization: `Bearer ${token}` };

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  function loadProducts() {
    axios.get<Product[]>("/api/admin/products", { headers }).then((r) => setProducts(r.data));
  }

  useEffect(() => {
    loadProducts();
    axios.get<Category[]>("/api/admin/categories", { headers }).then((r) => setCategories(r.data));
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleCreate(data: ProductFormValues) {
    setLoading(true);
    await axios.post("/api/admin/products", { ...data, imageUrl: data.imageUrl || undefined }, { headers });
    setCreating(false); setLoading(false); loadProducts();
  }

  async function handleEdit(data: ProductFormValues) {
    if (!editing) return;
    setLoading(true);
    await axios.patch(`/api/admin/products/${editing.id}`, { ...data, imageUrl: data.imageUrl || undefined }, { headers });
    setEditing(null); setLoading(false); loadProducts();
  }

  async function handleDelete(id: number) {
    if (!confirm(t("deleteProduct"))) return;
    await axios.delete(`/api/admin/products/${id}`, { headers });
    loadProducts();
  }

  const isModalOpen = creating || editing !== null;

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-page-title font-normal text-white">{t("products")}</h1>
        <Button variant="primary" onClick={() => { setCreating(true); setEditing(null); }}>
          {t("addProduct")}
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-w-2xl">
        {products.map((product) => (
          <ProductRow
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.image_url ?? undefined}
            onEdit={(id) => { setEditing(products.find((p) => p.id === id) ?? null); setCreating(false); }}
            onDelete={handleDelete}
          />
        ))}
        {products.length === 0 && <p className="text-gray-400 text-sm-body">{t("noProducts")}</p>}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label={creating ? t("newProduct") : t("editProduct")}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => { setCreating(false); setEditing(null); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-dark transition"
              aria-label={t("close")}
            >
              <X size={20} />
            </button>
            <h2 className="text-section-title font-bold text-dark mb-6">
              {creating ? t("newProduct") : t("editProduct")}
            </h2>
            <ProductEditForm
              categories={categories}
              defaultValues={editing ? {
                name: editing.name,
                description: editing.description ?? undefined,
                price: editing.price,
                imageUrl: editing.image_url ?? "",
                categoryId: editing.category_id ?? undefined,
                stock: editing.stock,
              } : undefined}
              onSubmit={creating ? handleCreate : handleEdit}
              onCancel={() => { setCreating(false); setEditing(null); }}
              loading={loading}
            />
          </div>
        </div>
      )}
    </main>
  );
}
