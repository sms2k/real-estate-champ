import axios from "axios";
import { BlogPost } from "@/types";
import { prisma } from "@/lib/db";

export interface WordPressPostOptions {
  title: string;
  content: string;
  excerpt?: string;
  featuredImageUrl?: string;
  categories?: number[]; // Category IDs
  tags?: number[]; // Tag IDs
  status?: "publish" | "draft" | "pending" | "private";
  date?: Date;
}

export interface WordPressPostResult {
  success: boolean;
  postId?: number;
  postUrl?: string;
  error?: string;
}

/**
 * Post to WordPress site
 */
export async function postToWordPress(
  siteId: string,
  blogPost: BlogPost,
  options?: Partial<WordPressPostOptions>
): Promise<WordPressPostResult> {
  try {
    const site = await prisma.wordPressSite.findUnique({
      where: { id: siteId },
    });

    if (!site || !site.isActive) {
      throw new Error("WordPress site not found or inactive");
    }

    const { siteUrl, username, appPassword } = site;

    // Upload featured image first
    let featuredMediaId: number | undefined;
    if (blogPost.featuredImage) {
      featuredMediaId = await uploadImageToWordPress(
        siteUrl,
        username,
        appPassword,
        blogPost.featuredImage
      );
    }

    // Create or get categories
    const categoryIds = await getOrCreateCategories(
      siteUrl,
      username,
      appPassword,
      blogPost.category ? [blogPost.category] : []
    );

    // Create or get tags
    const tagIds = await getOrCreateTags(
      siteUrl,
      username,
      appPassword,
      blogPost.tags || []
    );

    // Create the post
    const postData = {
      title: blogPost.title,
      content: blogPost.content,
      excerpt: blogPost.excerpt,
      status: options?.status || "publish",
      featured_media: featuredMediaId,
      categories: categoryIds.length > 0 ? categoryIds : undefined,
      tags: tagIds.length > 0 ? tagIds : undefined,
      date: options?.date?.toISOString(),
      meta: {
        _yoast_wpseo_title: blogPost.seoMeta?.title,
        _yoast_wpseo_metadesc: blogPost.seoMeta?.description,
        _yoast_wpseo_focuskw: blogPost.seoMeta?.keywords?.[0],
      },
    };

    const response = await axios.post(
      `${siteUrl}/wp-json/wp/v2/posts`,
      postData,
      {
        auth: {
          username,
          password: appPassword,
        },
      }
    );

    return {
      success: true,
      postId: response.data.id,
      postUrl: response.data.link,
    };
  } catch (error: any) {
    console.error("WordPress posting error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Upload an image to WordPress media library
 */
async function uploadImageToWordPress(
  siteUrl: string,
  username: string,
  appPassword: string,
  imagePath: string
): Promise<number> {
  try {
    let imageBuffer: Buffer;
    let filename: string;
    let mimeType: string;

    if (imagePath.startsWith("http")) {
      // Download from URL
      const response = await axios.get(imagePath, {
        responseType: "arraybuffer",
      });
      imageBuffer = Buffer.from(response.data);
      filename = imagePath.split("/").pop() || "image.jpg";
      mimeType = response.headers["content-type"] || "image/jpeg";
    } else {
      // Read from local file
      const fs = require("fs").promises;
      const path = require("path");
      imageBuffer = await fs.readFile(imagePath);
      filename = path.basename(imagePath);

      // Determine mime type from extension
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: Record<string, string> = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".gif": "image/gif",
        ".webp": "image/webp",
      };
      mimeType = mimeTypes[ext] || "image/jpeg";
    }

    const response = await axios.post(
      `${siteUrl}/wp-json/wp/v2/media`,
      imageBuffer,
      {
        auth: {
          username,
          password: appPassword,
        },
        headers: {
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Type": mimeType,
        },
      }
    );

    return response.data.id;
  } catch (error) {
    console.error("Error uploading image to WordPress:", error);
    throw error;
  }
}

/**
 * Get or create categories
 */
async function getOrCreateCategories(
  siteUrl: string,
  username: string,
  appPassword: string,
  categoryNames: string[]
): Promise<number[]> {
  const categoryIds: number[] = [];

  for (const categoryName of categoryNames) {
    try {
      // Try to find existing category
      const searchResponse = await axios.get(
        `${siteUrl}/wp-json/wp/v2/categories`,
        {
          params: { search: categoryName },
          auth: { username, password: appPassword },
        }
      );

      if (searchResponse.data.length > 0) {
        categoryIds.push(searchResponse.data[0].id);
      } else {
        // Create new category
        const createResponse = await axios.post(
          `${siteUrl}/wp-json/wp/v2/categories`,
          { name: categoryName },
          {
            auth: { username, password: appPassword },
          }
        );
        categoryIds.push(createResponse.data.id);
      }
    } catch (error) {
      console.error(`Error processing category ${categoryName}:`, error);
    }
  }

  return categoryIds;
}

/**
 * Get or create tags
 */
async function getOrCreateTags(
  siteUrl: string,
  username: string,
  appPassword: string,
  tagNames: string[]
): Promise<number[]> {
  const tagIds: number[] = [];

  for (const tagName of tagNames) {
    try {
      // Try to find existing tag
      const searchResponse = await axios.get(
        `${siteUrl}/wp-json/wp/v2/tags`,
        {
          params: { search: tagName },
          auth: { username, password: appPassword },
        }
      );

      if (searchResponse.data.length > 0) {
        tagIds.push(searchResponse.data[0].id);
      } else {
        // Create new tag
        const createResponse = await axios.post(
          `${siteUrl}/wp-json/wp/v2/tags`,
          { name: tagName },
          {
            auth: { username, password: appPassword },
          }
        );
        tagIds.push(createResponse.data.id);
      }
    } catch (error) {
      console.error(`Error processing tag ${tagName}:`, error);
    }
  }

  return tagIds;
}

/**
 * Test WordPress connection
 */
export async function testWordPressConnection(
  siteUrl: string,
  username: string,
  appPassword: string
): Promise<{ success: boolean; error?: string; siteInfo?: any }> {
  try {
    const response = await axios.get(
      `${siteUrl}/wp-json`,
      {
        auth: {
          username,
          password: appPassword,
        },
      }
    );

    return {
      success: true,
      siteInfo: {
        name: response.data.name,
        description: response.data.description,
        url: response.data.url,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
