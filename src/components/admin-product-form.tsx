"use client";

import { useActionState, useEffect, useState } from "react";
import { ProductType } from "@prisma/client";
import { PackagePlus, PenLine } from "lucide-react";
import {
  createProduct,
  updateProduct,
  type ProductActionState,
} from "@/app/actions/products";
import { MediaUploader } from "@/components/media-uploader";
import { useLocale } from "@/components/locale-provider";
import { UiButton } from "@/components/ui-button";
import { getProductImages } from "@/lib/products";

const initial: ProductActionState = { ok: false, message: "" };

export type AdminProductFormValues = {
  id: string;
  title: string;
  titleFr: string | null;
  slug: string;
  description: string;
  descriptionFr: string | null;
  type: ProductType;
  priceCents: number;
  stock: number | null;
  digitalUrl: string | null;
  published: boolean;
  coverUrl: string | null;
  images: unknown;
};

export function AdminProductForm({
  product,
  onCancelEdit,
}: {
  product?: AdminProductFormValues | null;
  onCancelEdit?: () => void;
}) {
  const editing = Boolean(product);
  const [state, action, pending] = useActionState(
    editing ? updateProduct : createProduct,
    initial,
  );
  const [images, setImages] = useState<string[]>(
    product ? getProductImages(product) : [],
  );
  const { t } = useLocale();
  const a = t.admin.common;

  useEffect(() => {
    setImages(product ? getProductImages(product) : []);
  }, [product]);

  useEffect(() => {
    if (state.ok && editing) onCancelEdit?.();
  }, [state, editing, onCancelEdit]);

  return (
    <form
      id="admin-product-form"
      action={action}
      className="mt-10 space-y-5 border border-line p-6"
    >
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <div>
        <p className="inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.22em] text-amber">
          {editing ? (
            <PenLine className="h-3.5 w-3.5" strokeWidth={1.6} />
          ) : (
            <PackagePlus className="h-3.5 w-3.5" strokeWidth={1.6} />
          )}
          Catalogue
        </p>
        <h2 className="mt-3 font-display text-2xl text-parchment">
          {editing ? a.editProduct : a.addProduct}
        </h2>
        <p className="mt-2 text-sm text-smoke">{a.productHelp}</p>
      </div>

      <input type="hidden" name="images" value={images.join("\n")} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label={a.titleEn}
          name="title"
          required
          defaultValue={product?.title}
        />
        <Field
          label={a.titleFr}
          name="titleFr"
          defaultValue={product?.titleFr ?? ""}
        />
        <Field
          label={a.slug}
          name="slug"
          placeholder="auto-from-title"
          defaultValue={product?.slug}
        />
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionEn}
          <textarea
            name="description"
            required
            rows={4}
            defaultValue={product?.description}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke md:col-span-2">
          {a.descriptionFr}
          <textarea
            name="descriptionFr"
            rows={4}
            defaultValue={product?.descriptionFr ?? ""}
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
          />
        </label>
        <label className="block text-sm text-smoke">
          {a.type}
          <select
            name="type"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
            defaultValue={product?.type ?? ProductType.BOOK_PHYSICAL}
          >
            <option value={ProductType.BOOK_PHYSICAL}>
              {t.productTypes.BOOK_PHYSICAL}
            </option>
            <option value={ProductType.BOOK_DIGITAL}>
              {t.productTypes.BOOK_DIGITAL}
            </option>
            <option value={ProductType.MERCH}>{t.productTypes.MERCH}</option>
          </select>
        </label>
        <Field
          label={a.price}
          name="priceCents"
          type="number"
          required
          placeholder="2400 = €24.00"
          defaultValue={product ? String(product.priceCents) : undefined}
        />
        <Field
          label={a.stock}
          name="stock"
          type="number"
          defaultValue={
            product?.stock != null ? String(product.stock) : undefined
          }
        />
        <Field
          label={a.digitalUrl}
          name="digitalUrl"
          defaultValue={product?.digitalUrl ?? ""}
        />
        <label className="flex items-center gap-3 text-sm text-smoke md:col-span-2">
          <input
            type="checkbox"
            name="published"
            className="accent-amber"
            defaultChecked={product?.published ?? false}
          />
          {a.publish}
        </label>
      </div>

      <MediaUploader
        label={a.gallery}
        accept="image/*"
        values={images}
        onChange={setImages}
      />

      <div className="flex flex-wrap gap-3">
        <UiButton
          type="submit"
          tone="amber"
          loading={pending}
          disabled={images.length === 0}
          icon={editing ? PenLine : PackagePlus}
        >
          {pending ? a.saving : editing ? a.saveProduct : a.createProduct}
        </UiButton>
        {editing ? (
          <UiButton type="button" tone="line" onClick={onCancelEdit}>
            {t.close}
          </UiButton>
        ) : null}
      </div>

      {state.message ? (
        <p className={`text-sm ${state.ok ? "text-amber-bright" : "text-sand"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <label className="block text-sm text-smoke">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="mt-2 w-full border border-line bg-ink px-3 py-2 text-parchment outline-none focus:border-amber"
      />
    </label>
  );
}
