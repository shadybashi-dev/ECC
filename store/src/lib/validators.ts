import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const categorySchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase, alphanumeric, hyphen-separated',
  }),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  sort: z.number().int().min(0).optional(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
})

export const productSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase, alphanumeric, hyphen-separated',
  }),
  description: z.string().optional(),
  shortDesc: z.string().optional(),
  sku: z.string().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']),
  categoryId: z.string().optional().or(z.literal('')),
  basePriceCents: z.number().int().min(0),
  trackInventory: z.boolean().optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  weightKg: z.number().optional(),
  dimensionsCm: z.string().optional(),
  materials: z.string().optional(),
  care: z.string().optional(),
  usage: z.string().optional(),
  restrictions: z.string().optional(),
  shippingInfo: z.string().optional(),
  returnInfo: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isFeatured: z.boolean().optional(),
  testData: z.boolean().optional(),
})

export const variantSchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  name: z.string().min(1).max(120),
  priceAdjCents: z.number().int().optional(),
  stock: z.number().int().min(0).optional(),
  reserved: z.number().int().min(0).optional(),
  isDefault: z.boolean().optional(),
  barCode: z.string().optional().or(z.literal('')),
  weightKg: z.number().optional(),
  active: z.boolean().optional(),
})

export const cartItemSchema = z.object({
  variantId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type ProductInput = z.infer<typeof productSchema>
export type VariantInput = z.infer<typeof variantSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
