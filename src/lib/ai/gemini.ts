import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { PropertyData, BlogPost, SocialMediaPost } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Initialize different models
const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

/**
 * Chat with Gemini to extract property information
 */
export async function chatWithGemini(
  messages: Array<{ role: string; content: string }>,
  context?: string
): Promise<string> {
  const chat = textModel.startChat({
    history: messages.slice(0, -1).map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });

  const lastMessage = messages[messages.length - 1];
  const prompt = context
    ? `Context: ${context}\n\nUser: ${lastMessage.content}`
    : lastMessage.content;

  const result = await chat.sendMessage(prompt);
  return result.response.text();
}

/**
 * Generate a blog post from property data
 */
export async function generateBlogPost(propertyData: PropertyData): Promise<BlogPost> {
  const prompt = `
You are a professional real estate content writer. Create an engaging, SEO-optimized blog post for the following property:

Property Details:
- Title: ${propertyData.basic.title}
- Price: $${propertyData.basic.price.toLocaleString()}
- Address: ${propertyData.basic.address}, ${propertyData.basic.city}, ${propertyData.basic.state}
- Type: ${propertyData.basic.propertyType}
- Bedrooms: ${propertyData.basic.bedrooms}
- Bathrooms: ${propertyData.basic.bathrooms}
- Square Feet: ${propertyData.basic.squareFeet}
- Description: ${propertyData.basic.description}

Features:
${Object.entries(propertyData.features).map(([key, value]) =>
  `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}`
).join('\n')}

Narrative:
- Highlights: ${propertyData.narrative.highlights.join(', ')}
- Neighborhood: ${propertyData.narrative.neighborhood}
- Unique Selling Points: ${propertyData.narrative.uniqueSellingPoints.join(', ')}

Generate a blog post in JSON format with the following structure:
{
  "title": "Catchy SEO-friendly title",
  "excerpt": "2-3 sentence excerpt",
  "content": "Full HTML content with headings, paragraphs, lists (minimum 800 words)",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "Property category",
  "seoMeta": {
    "title": "SEO title (60 chars max)",
    "description": "Meta description (155 chars max)",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}

Make it engaging, highlight the property's best features, and include information about the neighborhood and lifestyle.
`;

  const result = await textModel.generateContent(prompt);
  const responseText = result.response.text();

  // Extract JSON from response (handling markdown code blocks)
  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : responseText;

  const blogData = JSON.parse(jsonStr);

  return {
    ...blogData,
    featuredImage: propertyData.images.find(img => img.isMain)?.path || propertyData.images[0]?.path || "",
    images: propertyData.images.map(img => img.path),
  };
}

/**
 * Generate social media posts for different platforms
 */
export async function generateSocialMediaPosts(
  propertyData: PropertyData,
  platforms: string[]
): Promise<SocialMediaPost[]> {
  const posts: SocialMediaPost[] = [];

  for (const platform of platforms) {
    const post = await generateSinglePlatformPost(propertyData, platform as any);
    posts.push(post);
  }

  return posts;
}

async function generateSinglePlatformPost(
  propertyData: PropertyData,
  platform: 'facebook' | 'instagram' | 'linkedin' | 'google_business'
): Promise<SocialMediaPost> {
  const platformSpecs: Record<typeof platform, { maxLength: number; style: string; hashtagCount: number }> = {
    facebook: { maxLength: 500, style: "conversational and friendly", hashtagCount: 3 },
    instagram: { maxLength: 2200, style: "visually descriptive and aspirational", hashtagCount: 20 },
    linkedin: { maxLength: 700, style: "professional and informative", hashtagCount: 5 },
    google_business: { maxLength: 1500, style: "local and community-focused", hashtagCount: 3 },
  };

  const spec = platformSpecs[platform];

  const prompt = `
Create a ${platform} post for this property. Style: ${spec.style}

Property Details:
- ${propertyData.basic.title}
- $${propertyData.basic.price.toLocaleString()}
- ${propertyData.basic.bedrooms} bed, ${propertyData.basic.bathrooms} bath
- ${propertyData.basic.squareFeet} sq ft
- ${propertyData.basic.address}, ${propertyData.basic.city}

Highlights: ${propertyData.narrative.highlights.join(', ')}
Unique Features: ${propertyData.narrative.uniqueSellingPoints.join(', ')}

Requirements:
- Maximum ${spec.maxLength} characters
- Include ${spec.hashtagCount} relevant hashtags
- ${platform === 'instagram' ? 'Use emojis and line breaks for readability' : 'Professional tone'}
- Call to action at the end
- Highlight what makes this property special

Return JSON:
{
  "content": "The post text without hashtags",
  "hashtags": ["hashtag1", "hashtag2"]
}
`;

  const result = await textModel.generateContent(prompt);
  const responseText = result.response.text();

  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
  const postData = JSON.parse(jsonStr);

  return {
    platform,
    content: postData.content,
    hashtags: postData.hashtags,
    images: propertyData.images
      .sort((a, b) => a.order - b.order)
      .slice(0, platform === 'instagram' ? 10 : 4)
      .map(img => img.path),
  };
}

/**
 * Extract property information from chat conversation
 */
export async function extractPropertyDataFromChat(
  chatHistory: Array<{ role: string; content: string }>
): Promise<Partial<PropertyData>> {
  const prompt = `
You are analyzing a conversation about a real estate property. Extract all the property information mentioned in the conversation and structure it.

Conversation:
${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Extract the following information if available and return as JSON:
{
  "basic": {
    "title": "property title or null",
    "description": "description or null",
    "address": "address or null",
    "city": "city or null",
    "state": "state or null",
    "zipCode": "zipCode or null",
    "price": number or null,
    "bedrooms": number or null,
    "bathrooms": number or null,
    "squareFeet": number or null,
    "propertyType": "type or null",
    "lotSize": "lot size or null",
    "yearBuilt": number or null
  },
  "features": {
    "interior": ["feature1", "feature2"],
    "exterior": [],
    "appliances": [],
    "heating": "type or null",
    "cooling": "type or null",
    "parking": "info or null"
  },
  "narrative": {
    "highlights": ["highlight1", "highlight2"],
    "neighborhood": "neighborhood info or null",
    "schools": [],
    "transportation": "transportation info or null",
    "uniqueSellingPoints": []
  }
}

Only include information that was explicitly mentioned. Use null for missing data.
`;

  const result = await textModel.generateContent(prompt);
  const responseText = result.response.text();

  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/(\{[\s\S]*\})/);
  const jsonStr = jsonMatch ? jsonMatch[1] : responseText;

  return JSON.parse(jsonStr);
}

/**
 * Generate questions to gather missing property information
 */
export async function generatePropertyQuestions(
  currentData: Partial<PropertyData>
): Promise<string[]> {
  const prompt = `
Given the current property data, generate 3-5 relevant questions to gather missing important information.

Current Data:
${JSON.stringify(currentData, null, 2)}

Return an array of questions as JSON: ["question1", "question2", ...]

Focus on asking about:
- Basic property details (if missing)
- Unique features and selling points
- Neighborhood and location benefits
- Recent updates or renovations
- Target buyer demographics

Make questions conversational and easy to answer.
`;

  const result = await textModel.generateContent(prompt);
  const responseText = result.response.text();

  const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/(\[[\s\S]*\])/);
  const jsonStr = jsonMatch ? jsonMatch[1] : responseText;

  return JSON.parse(jsonStr);
}
