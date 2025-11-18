import axios from "axios";
import { prisma } from "@/lib/db";

const FACEBOOK_API_VERSION = "v21.0";
const FACEBOOK_API_BASE = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export interface FacebookPostOptions {
  message: string;
  link?: string;
  images?: string[]; // Local file paths or URLs
  scheduledTime?: Date;
  pageId: string;
}

export interface FacebookPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Post to Facebook Page
 */
export async function postToFacebook(
  userId: string,
  options: FacebookPostOptions
): Promise<FacebookPostResult> {
  try {
    // Get user's Facebook credentials
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: "FACEBOOK",
        isActive: true,
      },
    });

    if (!socialAccount || !socialAccount.pageAccessToken) {
      throw new Error("Facebook account not connected or page not selected");
    }

    const pageAccessToken = socialAccount.pageAccessToken;
    const pageId = options.pageId || socialAccount.pageId;

    if (!pageId) {
      throw new Error("Facebook page ID not found");
    }

    // If we have images, upload them first
    let photoIds: string[] = [];
    if (options.images && options.images.length > 0) {
      photoIds = await uploadPhotosToFacebook(pageId, options.images, pageAccessToken);
    }

    // Create the post
    const postData: any = {
      message: options.message,
      access_token: pageAccessToken,
    };

    if (options.link) {
      postData.link = options.link;
    }

    if (photoIds.length > 0) {
      if (photoIds.length === 1) {
        // Single photo post
        delete postData.message;
        const photoResponse = await axios.post(
          `${FACEBOOK_API_BASE}/${photoIds[0]}`,
          {
            published: !options.scheduledTime,
            scheduled_publish_time: options.scheduledTime
              ? Math.floor(options.scheduledTime.getTime() / 1000)
              : undefined,
          }
        );
        return {
          success: true,
          postId: photoResponse.data.id,
        };
      } else {
        // Multiple photos - create album post
        postData.attached_media = photoIds.map(id => ({ media_fbid: id }));
      }
    }

    if (options.scheduledTime) {
      postData.published = false;
      postData.scheduled_publish_time = Math.floor(options.scheduledTime.getTime() / 1000);
    }

    const response = await axios.post(
      `${FACEBOOK_API_BASE}/${pageId}/feed`,
      postData
    );

    return {
      success: true,
      postId: response.data.id,
    };
  } catch (error: any) {
    console.error("Facebook posting error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Upload photos to Facebook and return photo IDs
 */
async function uploadPhotosToFacebook(
  pageId: string,
  imagePaths: string[],
  accessToken: string
): Promise<string[]> {
  const photoIds: string[] = [];

  for (const imagePath of imagePaths) {
    try {
      const formData = new FormData();

      // If it's a URL, use it directly; otherwise read the file
      if (imagePath.startsWith("http")) {
        formData.append("url", imagePath);
      } else {
        // Read file and upload
        const fs = require("fs").promises;
        const fileBuffer = await fs.readFile(imagePath);
        const blob = new Blob([fileBuffer]);
        formData.append("source", blob);
      }

      formData.append("published", "false");
      formData.append("access_token", accessToken);

      const response = await axios.post(
        `${FACEBOOK_API_BASE}/${pageId}/photos`,
        formData
      );

      photoIds.push(response.data.id);
    } catch (error) {
      console.error("Failed to upload photo:", imagePath, error);
    }
  }

  return photoIds;
}

/**
 * Get user's Facebook pages
 */
export async function getFacebookPages(accessToken: string) {
  try {
    const response = await axios.get(
      `${FACEBOOK_API_BASE}/me/accounts`,
      {
        params: {
          access_token: accessToken,
          fields: "id,name,access_token,picture",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching Facebook pages:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Exchange short-lived token for long-lived token
 */
export async function getPageLongLivedToken(
  shortLivedToken: string,
  appId: string,
  appSecret: string
): Promise<string> {
  try {
    const response = await axios.get(
      `${FACEBOOK_API_BASE}/oauth/access_token`,
      {
        params: {
          grant_type: "fb_exchange_token",
          client_id: appId,
          client_secret: appSecret,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    return response.data.access_token;
  } catch (error: any) {
    console.error("Error getting long-lived token:", error.response?.data || error.message);
    throw error;
  }
}
