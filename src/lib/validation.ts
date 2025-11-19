import { z } from 'zod';

/**
 * Validation schemas using Zod
 */

// User registration
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  companyName: z.string().optional(),
});

// User login
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Property creation/update
export const propertySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(5000).optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  zipCode: z.string().max(20).optional(),
  price: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  squareFeet: z.number().int().positive().optional(),
  propertyType: z.string().max(50).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
});

// Social account connection
export const socialAccountSchema = z.object({
  platform: z.enum(['FACEBOOK', 'INSTAGRAM', 'LINKEDIN', 'GOOGLE_BUSINESS', 'WORDPRESS']),
  platformUserId: z.string().min(1),
  platformUsername: z.string().optional(),
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
  scope: z.string().optional(),
  pageId: z.string().optional(),
  pageAccessToken: z.string().optional(),
});

// Webhook configuration
export const webhookSchema = z.object({
  name: z.string().min(1, 'Webhook name is required').max(100),
  url: z.string().url('Must be a valid URL'),
  secret: z.string().optional(),
});

// Chat message
export const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })),
  propertyId: z.string().optional(),
});

// Content generation
export const contentGenerationSchema = z.object({
  propertyId: z.string().cuid(),
  platforms: z.array(z.enum(['blog', 'facebook', 'instagram', 'linkedin', 'google_business'])),
  generateVideo: z.boolean().optional(),
  editImages: z.boolean().optional(),
});

// File upload validation
export const fileUploadSchema = z.object({
  maxSize: z.number().default(10485760), // 10MB
  allowedTypes: z.array(z.string()).default(['image/jpeg', 'image/png', 'image/webp']),
});

// Branding/white-label
export const brandingSchema = z.object({
  companyName: z.string().min(1).max(100).optional(),
  companyLogo: z.string().url().optional(),
  customDomain: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/).optional(),
});

/**
 * Validation helper function
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Format Zod errors for API response
 */
export function formatZodErrors(errors: z.ZodError) {
  return errors.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
  }));
}
