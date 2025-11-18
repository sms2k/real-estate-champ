import axios from "axios";
import { prisma } from "@/lib/db";

const FACEBOOK_API_VERSION = "v21.0";
const FACEBOOK_API_BASE = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export interface InstagramPostOptions {
  caption: string;
  imageUrl: string; // Must be a publicly accessible URL
  isCarousel?: boolean;
  carouselImages?: string[]; // Array of public URLs
}

export interface InstagramPostResult {
  success: boolean;
  mediaId?: string;
  error?: string;
}

/**
 * Post to Instagram Business Account
 * Note: Images must be publicly accessible URLs
 */
export async function postToInstagram(
  userId: string,
  options: InstagramPostOptions
): Promise<InstagramPostResult> {
  try {
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: "INSTAGRAM",
        isActive: true,
      },
    });

    if (!socialAccount) {
      throw new Error("Instagram account not connected");
    }

    const igUserId = socialAccount.platformUserId;
    const accessToken = socialAccount.accessToken;

    if (options.isCarousel && options.carouselImages && options.carouselImages.length > 1) {
      return await postCarouselToInstagram(
        igUserId,
        accessToken,
        options.carouselImages,
        options.caption
      );
    } else {
      return await postSingleImageToInstagram(
        igUserId,
        accessToken,
        options.imageUrl,
        options.caption
      );
    }
  } catch (error: any) {
    console.error("Instagram posting error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Post a single image to Instagram
 */
async function postSingleImageToInstagram(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<InstagramPostResult> {
  // Step 1: Create media container
  const containerResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${igUserId}/media`,
    {
      image_url: imageUrl,
      caption: caption,
      access_token: accessToken,
    }
  );

  const creationId = containerResponse.data.id;

  // Step 2: Wait a moment for processing
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Step 3: Publish the media
  const publishResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${igUserId}/media_publish`,
    {
      creation_id: creationId,
      access_token: accessToken,
    }
  );

  return {
    success: true,
    mediaId: publishResponse.data.id,
  };
}

/**
 * Post a carousel (multiple images) to Instagram
 */
async function postCarouselToInstagram(
  igUserId: string,
  accessToken: string,
  imageUrls: string[],
  caption: string
): Promise<InstagramPostResult> {
  // Step 1: Create containers for each image
  const containerIds: string[] = [];

  for (const imageUrl of imageUrls) {
    const response = await axios.post(
      `${FACEBOOK_API_BASE}/${igUserId}/media`,
      {
        image_url: imageUrl,
        is_carousel_item: true,
        access_token: accessToken,
      }
    );
    containerIds.push(response.data.id);
  }

  // Step 2: Create carousel container
  const carouselResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${igUserId}/media`,
    {
      media_type: "CAROUSEL",
      children: containerIds.join(","),
      caption: caption,
      access_token: accessToken,
    }
  );

  const carouselId = carouselResponse.data.id;

  // Step 3: Wait for processing
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Step 4: Publish the carousel
  const publishResponse = await axios.post(
    `${FACEBOOK_API_BASE}/${igUserId}/media_publish`,
    {
      creation_id: carouselId,
      access_token: accessToken,
    }
  );

  return {
    success: true,
    mediaId: publishResponse.data.id,
  };
}

/**
 * Get Instagram Business Account ID from Facebook Page
 */
export async function getInstagramBusinessAccountId(
  facebookPageId: string,
  pageAccessToken: string
): Promise<string | null> {
  try {
    const response = await axios.get(
      `${FACEBOOK_API_BASE}/${facebookPageId}`,
      {
        params: {
          fields: "instagram_business_account",
          access_token: pageAccessToken,
        },
      }
    );

    return response.data.instagram_business_account?.id || null;
  } catch (error: any) {
    console.error("Error getting Instagram account:", error.response?.data || error.message);
    return null;
  }
}

/**
 * Get Instagram account info
 */
export async function getInstagramAccountInfo(
  igUserId: string,
  accessToken: string
) {
  try {
    const response = await axios.get(
      `${FACEBOOK_API_BASE}/${igUserId}`,
      {
        params: {
          fields: "id,username,profile_picture_url,followers_count,media_count",
          access_token: accessToken,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error getting Instagram info:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Upload image to a public host (required for Instagram API)
 * This is a helper function - you'll need to implement based on your hosting
 */
export async function uploadImageForInstagram(filePath: string): Promise<string> {
  // TODO: Implement image upload to a public host
  // Options:
  // 1. Upload to your own server with public URL
  // 2. Upload to cloud storage (AWS S3, Google Cloud Storage, Cloudinary)
  // 3. Use a CDN

  // For now, return a placeholder
  // In production, this should upload the file and return a public URL

  console.log("Would upload image:", filePath);

  // Example with Cloudinary (if you choose to use it):
  /*
  const cloudinary = require('cloudinary').v2;

  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'real-estate-properties',
    resource_type: 'image'
  });

  return result.secure_url;
  */

  // Placeholder - replace with actual implementation
  return `https://yourdomain.com/uploads/${filePath.split("/").pop()}`;
}
