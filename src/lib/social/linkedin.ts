import axios from "axios";
import { prisma } from "@/lib/db";

const LINKEDIN_API_BASE = "https://api.linkedin.com/v2";

export interface LinkedInPostOptions {
  text: string;
  link?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
}

export interface LinkedInPostResult {
  success: boolean;
  postId?: string;
  error?: string;
}

/**
 * Post to LinkedIn
 */
export async function postToLinkedIn(
  userId: string,
  options: LinkedInPostOptions
): Promise<LinkedInPostResult> {
  try {
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: "LINKEDIN",
        isActive: true,
      },
    });

    if (!socialAccount) {
      throw new Error("LinkedIn account not connected");
    }

    const accessToken = socialAccount.accessToken;
    const linkedInUserId = socialAccount.platformUserId;

    // Prepare the post payload
    const postData: any = {
      author: `urn:li:person:${linkedInUserId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: options.text,
          },
          shareMediaCategory: options.imageUrl ? "IMAGE" : options.link ? "ARTICLE" : "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Add image if provided
    if (options.imageUrl) {
      const assetId = await uploadImageToLinkedIn(
        accessToken,
        linkedInUserId,
        options.imageUrl
      );

      postData.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          description: {
            text: options.description || options.text,
          },
          media: assetId,
          title: {
            text: options.title || "Property Listing",
          },
        },
      ];
    }
    // Add link if provided
    else if (options.link) {
      postData.specificContent["com.linkedin.ugc.ShareContent"].media = [
        {
          status: "READY",
          originalUrl: options.link,
          title: {
            text: options.title || "View Property",
          },
          description: {
            text: options.description || options.text,
          },
        },
      ];
    }

    const response = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    return {
      success: true,
      postId: response.data.id,
    };
  } catch (error: any) {
    console.error("LinkedIn posting error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}

/**
 * Upload image to LinkedIn
 */
async function uploadImageToLinkedIn(
  accessToken: string,
  linkedInUserId: string,
  imageUrl: string
): Promise<string> {
  // Step 1: Register upload
  const registerResponse = await axios.post(
    `${LINKEDIN_API_BASE}/assets?action=registerUpload`,
    {
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: `urn:li:person:${linkedInUserId}`,
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const uploadUrl = registerResponse.data.value.uploadMechanism[
    "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
  ].uploadUrl;

  const asset = registerResponse.data.value.asset;

  // Step 2: Upload the image
  let imageBuffer: Buffer;

  if (imageUrl.startsWith("http")) {
    // Download image from URL
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    imageBuffer = Buffer.from(imageResponse.data);
  } else {
    // Read from local file
    const fs = require("fs").promises;
    imageBuffer = await fs.readFile(imageUrl);
  }

  await axios.put(uploadUrl, imageBuffer, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/octet-stream",
    },
  });

  return asset;
}

/**
 * Get LinkedIn user profile
 */
export async function getLinkedInProfile(accessToken: string) {
  try {
    const response = await axios.get(
      `${LINKEDIN_API_BASE}/me`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error getting LinkedIn profile:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get LinkedIn organization (company page) info
 * For posting to company pages instead of personal profile
 */
export async function getLinkedInOrganizations(accessToken: string) {
  try {
    const response = await axios.get(
      `${LINKEDIN_API_BASE}/organizationAcls?q=roleAssignee&projection=(elements*(organization~(localizedName,logoV2)))`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data.elements;
  } catch (error: any) {
    console.error("Error getting LinkedIn organizations:", error.response?.data || error.message);
    throw error;
  }
}
