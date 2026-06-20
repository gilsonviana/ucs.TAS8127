"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import TextInput from "./TextInput";
import Button from "./Button";

const toNumber = (val: unknown) => (val === "" || val === undefined ? undefined : Number(val));

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.preprocess(toNumber, z.number().positive()),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.preprocess(toNumber, z.number().optional()),
  stock: z.preprocess(toNumber, z.number().int().min(0)),
});

export type ProductFormValues = z.infer<typeof schema>;

interface Category {
  id: number;
  name: string;
}

interface ProductEditFormProps {
  defaultValues?: Partial<ProductFormValues>;
  categories: Category[];
  onSubmit: (data: ProductFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function ProductEditForm({
  defaultValues,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}: ProductEditFormProps) {
  const t = useTranslations("admin");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<ProductFormValues>,
    defaultValues: { stock: 0, ...defaultValues },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <TextInput
        label="Name"
        id="name"
        error={errors.name?.message}
        {...register("name")}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-dark">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-dark text-body focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          {...register("description")}
        />
      </div>
      <TextInput
        label="Price ($)"
        id="price"
        type="number"
        step="0.01"
        error={errors.price?.message}
        {...register("price")}
      />
      <TextInput
        label="Image URL"
        id="imageUrl"
        type="url"
        error={errors.imageUrl?.message}
        {...register("imageUrl")}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="categoryId" className="text-sm font-medium text-dark">
          Category
        </label>
        <select
          id="categoryId"
          className="w-full px-3 py-2 rounded-md border border-gray-300 bg-white text-dark text-body focus:outline-none focus:ring-2 focus:ring-primary transition"
          {...register("categoryId")}
        >
          <option value="">— None —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <TextInput
        label="Stock"
        id="stock"
        type="number"
        error={errors.stock?.message}
        {...register("stock")}
      />
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="danger" onClick={onCancel}>
            {t("cancel")}
          </Button>
        )}
        <Button type="submit" variant="success" disabled={loading}>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
