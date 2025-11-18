import axios from "axios";
import { prisma } from "@/lib/db";

const GOOGLE_BUSINESS_API_BASE = "https://mybusiness.googleapis.com/v4";
const GOOGLE_BUSINESS_API_V1_BASE = "https://mybusinessbusinessinformation.googleapis.com/v1";

export interface GoogleBusinessPostOptions {
  summary: string;
  imageUrl?: string;
  callToAction?: {
    actionType: "BOOK" | "ORDER" | "SHOP" | "LEARN_MORE" | "SIGN_UP" | "CALL";
    url?: string;
  };
  event?: {
    title: string;
    schedule: {
      startDate: Date;
      startTime?: string;
      endDate?: Date;
      endTime?: string;
    };
  };
  offer?: {
    couponCode?: string;
    redeemOnlineUrl?: string;
    termsConditions?: string;
  };
}

export interface GoogleBusinessPostResult {
  success: boolean;
  postName?: string;
  error?: string;
}

/**
 * Post to Google Business Profile
 */
export async function postToGoogleBusiness(
  userId: string,
  locationName: string, // Format: "accounts/{accountId}/locations/{locationId}"
  options: GoogleBusinessPostOptions
): Promise<GoogleBusinessPostResult> {
  try {
    const socialAccount = await prisma.socialAccount.findFirst({
      where: {
        userId,
        platform: "GOOGLE_BUSINESS",
        isActive: true,
      },
    });

    if (!socialAccount) {
      throw new Error("Google Business account not connected");
    }

    const accessToken = socialAccount.accessToken;

    // Prepare the local post
    const postData: any = {
      languageCode: "en-US",
      summary: options.summary,
      topicType: "STANDARD", // Can be STANDARD, EVENT, or OFFER
    };

    // Add image if provided
    if (options.imageUrl) {
      postData.media = [
        {
          mediaFormat: "PHOTO",
          sourceUrl: options.imageUrl,
        },
      ];
    }

    // Add call to action
    if (options.callToAction) {
      postData.callToAction = {
        actionType: options.callToAction.actionType,
        url: options.callToAction.url,
      };
    }

    // For event posts
    if (options.event) {
      postData.topicType = "EVENT";
      postData.event = {
        title: options.event.title,
        schedule: {
          startDate: {
            year: options.event.schedule.startDate.getFullYear(),
            month: options.event.schedule.startDate.getMonth() + 1,
            day: options.event.schedule.startDate.getDate(),
          },
          startTime: options.event.schedule.startTime
            ? parseTimeString(options.event.schedule.startTime)
            : undefined,
          endDate: options.event.schedule.endDate
            ? {
                year: options.event.schedule.endDate.getFullYear(),
                month: options.event.schedule.endDate.getMonth() + 1,
                day: options.event.schedule.endDate.getDate(),
              }
            : undefined,
          endTime: options.event.schedule.endTime
            ? parseTimeString(options.event.schedule.endTime)
            : undefined,
        },
      };
    }

    // For offer posts
    if (options.offer) {
      postData.topicType = "OFFER";
      postData.offer = {
        couponCode: options.offer.couponCode,
        redeemOnlineUrl: options.offer.redeemOnlineUrl,
        termsConditions: options.offer.termsConditions,
      };
    }

    const response = await axios.post(
      `${GOOGLE_BUSINESS_API_BASE}/${locationName}/localPosts`,
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      success: true,
      postName: response.data.name,
    };
  } catch (error: any) {
    console.error("Google Business posting error:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Get user's Google Business locations
 */
export async function getGoogleBusinessLocations(accessToken: string) {
  try {
    // First, get accounts
    const accountsResponse = await axios.get(
      `${GOOGLE_BUSINESS_API_V1_BASE}/accounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const accounts = accountsResponse.data.accounts || [];

    if (accounts.length === 0) {
      return [];
    }

    // Get locations for each account
    const allLocations = [];

    for (const account of accounts) {
      try {
        const locationsResponse = await axios.get(
          `${GOOGLE_BUSINESS_API_V1_BASE}/${account.name}/locations`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              readMask: "name,title,storefrontAddress,phoneNumbers",
            },
          }
        );

        if (locationsResponse.data.locations) {
          allLocations.push(...locationsResponse.data.locations);
        }
      } catch (error) {
        console.error(`Error fetching locations for ${account.name}:`, error);
      }
    }

    return allLocations;
  } catch (error: any) {
    console.error("Error getting Google Business locations:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get location information
 */
export async function getLocationInfo(
  accessToken: string,
  locationName: string
) {
  try {
    const response = await axios.get(
      `${GOOGLE_BUSINESS_API_V1_BASE}/${locationName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          readMask: "name,title,storefrontAddress,websiteUri,phoneNumbers,categories,profile",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error getting location info:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Helper function to parse time string
 */
function parseTimeString(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return {
    hours,
    minutes,
  };
}

/**
 * Delete a Google Business post
 */
export async function deleteGoogleBusinessPost(
  accessToken: string,
  postName: string // Format: "accounts/{accountId}/locations/{locationId}/localPosts/{postId}"
) {
  try {
    await axios.delete(
      `${GOOGLE_BUSINESS_API_BASE}/${postName}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting Google Business post:", error.response?.data || error.message);
    throw error;
  }
}
