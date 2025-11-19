import { PropertyData, BlogPost, SocialMediaPost } from "@/types";

/**
 * Convert Prisma Property to PropertyData format for AI
 */
export function propertyToPropertyData(property: any): PropertyData {
  return {
    basic: {
      title: property.title,
      description: property.description || "",
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      zipCode: property.zipCode || "",
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      squareFeet: property.squareFeet || 0,
      propertyType: property.propertyType || "",
      lotSize: "",
      yearBuilt: undefined,
    },
    features: {
      interior: [],
      exterior: [],
      appliances: [],
      heating: "",
      cooling: "",
      parking: "",
    },
    narrative: {
      highlights: [],
      neighborhood: "",
      schools: [],
      transportation: "",
      uniqueSellingPoints: [],
    },
    images: [],
    chatHistory: [],
  };
}

/**
 * Simplified blog post generation for properties without full data
 */
export async function generateBlogPostSimple(property: {
  title: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  squareFeet?: number | null;
  propertyType?: string | null;
}): Promise<BlogPost> {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
Create an engaging, SEO-optimized blog post for this property:

${property.title}
${property.price ? `$${property.price.toLocaleString()}` : ""}
${property.address ? `${property.address}, ` : ""}${property.city || ""}${property.state ? `, ${property.state}` : ""}
${property.propertyType || ""}
${property.bedrooms ? `${property.bedrooms} Bedrooms` : ""} ${property.bathrooms ? `${property.bathrooms} Bathrooms` : ""}
${property.squareFeet ? `${property.squareFeet} sq ft` : ""}
${property.description || ""}

Return JSON with this structure (no markdown formatting):
{
  "title": "Catchy SEO title",
  "excerpt": "Brief 2-sentence summary",
  "content": "Full HTML blog post (800+ words with headings and paragraphs)",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Real Estate",
  "seoMeta": {
    "title": "SEO title 60 chars",
    "description": "Meta description 155 chars",
    "keywords": ["keyword1", "keyword2"]
  }
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean and parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text;
  const data = JSON.parse(jsonStr);

  return {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    tags: data.tags || [],
    category: data.category || "Real Estate",
    seoMeta: data.seoMeta || {
      title: data.title.slice(0, 60),
      description: data.excerpt.slice(0, 155),
      keywords: [],
    },
    featuredImage: "",
    images: [],
  };
}

/**
 * Simplified social media post generation
 */
export async function generateSocialPostSimple(
  property: {
    title: string;
    description?: string | null;
    city?: string | null;
    state?: string | null;
    price?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    squareFeet?: number | null;
  },
  platform: string
): Promise<SocialMediaPost> {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const specs: Record<string, { max: number; hashtags: number; style: string }> = {
    facebook: { max: 500, hashtags: 3, style: "friendly and conversational" },
    instagram: { max: 2200, hashtags: 20, style: "visual and aspirational with emojis" },
    linkedin: { max: 700, hashtags: 5, style: "professional and informative" },
    google_business: { max: 1500, hashtags: 3, style: "local and community-focused" },
  };

  const spec = specs[platform] || specs.facebook;

  const prompt = `
Create a ${platform} post for this property in ${spec.style} style:

${property.title}
${property.price ? `$${property.price.toLocaleString()}` : ""}
${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath${property.squareFeet ? `, ${property.squareFeet} sq ft` : ""}
${property.city || ""}${property.state ? `, ${property.state}` : ""}

${property.description || ""}

Max ${spec.max} characters. Include ${spec.hashtags} hashtags.

Return JSON (no markdown):
{
  "content": "Post text without hashtags",
  "hashtags": ["hashtag1", "hashtag2"]
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const jsonStr = jsonMatch ? jsonMatch[0] : text;
  const data = JSON.parse(jsonStr);

  return {
    platform: platform as any,
    content: data.content,
    hashtags: data.hashtags || [],
    images: [],
  };
}
