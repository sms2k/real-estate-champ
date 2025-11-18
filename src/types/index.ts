import { Property, PropertyImage, User, SocialAccount, GeneratedContent, Webhook, WordPressSite } from '@prisma/client';

export type { Property, PropertyImage, User, SocialAccount, GeneratedContent, Webhook, WordPressSite };

// Extended types with relations
export type PropertyWithRelations = Property & {
  images: PropertyImage[];
  user: User;
};

export type UserWithSocialAccounts = User & {
  socialAccounts: SocialAccount[];
};

// Chat message types for property information gathering
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface PropertyChatSession {
  propertyId: string;
  messages: ChatMessage[];
  extractedData: Partial<PropertyData>;
}

// Property data structure for JSON storage
export interface PropertyData {
  basic: {
    title: string;
    description: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string;
    lotSize?: string;
    yearBuilt?: number;
  };
  features: {
    interior: string[];
    exterior: string[];
    appliances: string[];
    heating: string;
    cooling: string;
    parking: string;
  };
  narrative: {
    highlights: string[];
    neighborhood: string;
    schools: string[];
    transportation: string;
    uniqueSellingPoints: string[];
  };
  images: {
    path: string;
    caption: string;
    order: number;
    isMain: boolean;
  }[];
  chatHistory: ChatMessage[];
}

// Social media post structure
export interface SocialMediaPost {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'google_business';
  content: string;
  images: string[];
  hashtags: string[];
  link?: string;
  scheduledTime?: Date;
}

// Blog post structure
export interface BlogPost {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  images: string[];
  tags: string[];
  category: string;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Webhook payload
export interface WebhookPayload {
  event: 'content.generated' | 'content.published' | 'property.created';
  propertyId: string;
  contentType: string;
  data: {
    blog?: BlogPost;
    social?: SocialMediaPost[];
    videoUrl?: string;
    images?: string[];
  };
  timestamp: Date;
}

// AI generation request
export interface ContentGenerationRequest {
  propertyId: string;
  propertyData: PropertyData;
  platforms: string[];
  generateVideo: boolean;
  editImages: boolean;
}

// OAuth connection status
export interface OAuthStatus {
  platform: string;
  connected: boolean;
  username?: string;
  expiresAt?: Date;
  needsReauth: boolean;
}

// Admin API key config
export interface ApiKeyConfig {
  name: string;
  key: string;
  secret?: string;
  metadata?: Record<string, any>;
}
