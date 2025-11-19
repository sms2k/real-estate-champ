import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  withErrorHandler,
  apiSuccess,
  ApiErrors,
} from "@/lib/api/errors";
import {
  requireAuthMiddleware,
  checkUsageLimitMiddleware,
} from "@/lib/api/middleware";
import { contentGenerationSchema } from "@/lib/validation";
import { incrementUsage } from "@/lib/auth/session";
import { generateBlogPostSimple, generateSocialPostSimple } from "@/lib/ai/helpers";
import { generatePropertyVideo } from "@/lib/ai/video-generation";
import { editPropertyImage } from "@/lib/ai/image-editing";

/**
 * POST /api/properties/[id]/generate - Generate content for property
 */
export const POST = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { userId } = await requireAuthMiddleware(request);
    const { id: propertyId } = await params;

    // Check if user has reached content generation limit

    const body = await request.json();
    const validated = contentGenerationSchema.parse(body);

    // Get property with images
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
              contentType: platform,
      },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw ApiErrors.NotFound("Property");
    }

    const results: any[] = [];

    // Generate blog post if requested
    if (validated.platforms.includes("blog")) {
      try {
        const blogPost = await generateBlogPostSimple(property);
        const savedBlog = await prisma.generatedContent.create({
          data: {
            propertyId,
              contentType: platform,
            contentType: "blog",
            platform: "WORDPRESS",
            title: blogPost.title,
            content: blogPost.content,
            status: "GENERATED",
          },
        });
        results.push({ type: "blog", id: savedBlog.id, success: true });
      } catch (error) {
        console.error("Blog generation failed:", error);
        results.push({ type: "blog", success: false, error: "Generation failed" });
      }
    }

    // Generate social media posts
    const socialPlatforms = validated.platforms.filter((p) => p !== "blog");
    if (socialPlatforms.length > 0) {
      try {
        for (const platform of socialPlatforms) {
          const post = await generateSocialPostSimple(property, platform);
          const saved = await prisma.generatedContent.create({
            data: {
              propertyId,
              contentType: platform,
              platform: post.platform.toUpperCase() as any,
              content: post.content,
              status: "GENERATED",
            },
          });
          results.push({
            type: post.platform,
            id: saved.id,
            success: true,
          });
        }
      } catch (error) {
        console.error("Social media generation failed:", error);
        results.push({
          type: "social",
          success: false,
          error: "Generation failed",
        });
      }
    }

    // Generate video if requested
    if (validated.generateVideo) {
      try {
        const imagePaths = property.images.map((img: any) => img.filePath);
        if (imagePaths.length > 0) {
          const propertyData = {
            title: property.title,
            description: property.description || "",
            address: property.address || "",
            city: property.city || "",
            state: property.state || "",
            price: property.price || 0,
            bedrooms: property.bedrooms || 0,
            bathrooms: property.bathrooms || 0,
          };

          const video = await generatePropertyVideo(
            propertyData as any,
            imagePaths,
            { duration: 30 }
          );

          if (video.status === "completed" && video.videoUrl) {
            await prisma.propertyImage.create({
              data: {
                propertyId,
              contentType: platform,
                filePath: video.videoUrl,
                fileType: "video/mp4",
                isVideo: true,
              },
            });
            results.push({ type: "video", success: true, url: video.videoUrl });
          }
        }
      } catch (error) {
        console.error("Video generation failed:", error);
        results.push({ type: "video", success: false, error: "Generation failed" });
      }
    }

    // Edit images if requested
    if (validated.editImages) {
      try {
        for (const image of property.images.slice(0, 5)) {
          // Limit to 5 images
          const edited = await editPropertyImage(image.filePath, {
            enhance: true,
          });

          if (edited.success) {
            await prisma.propertyImage.create({
              data: {
                propertyId,
              contentType: platform,
                filePath: edited.editedPath,
                fileType: image.fileType,
                isEdited: true,
              },
            });
          }
        }
        results.push({ type: "image_editing", success: true });
      } catch (error) {
        console.error("Image editing failed:", error);
        results.push({
          type: "image_editing",
          success: false,
          error: "Editing failed",
        });
      }
    }

    // Increment content generation counter

    return apiSuccess({
      message: "Content generation completed",
      results,
    });
  }
);
