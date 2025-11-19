"use client";

import { useState, useEffect, useRef } from "react";
import { use} from "react";
import { useRouter } from "next/navigation";
import { LoadingPage } from "@/components/LoadingSpinner";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [resolvedParams.id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setProperty(data);
      }
    } catch (error) {
      console.error("Failed to fetch property:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`/api/properties/${resolvedParams.id}/images`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchProperty();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateContent = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/properties/${resolvedParams.id}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platforms: ["facebook", "instagram", "blog"],
          generateVideo: false,
          editImages: false,
        }),
      });

      if (res.ok) {
        alert("Content generated successfully!");
        await fetchProperty();
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate content");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-white"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold truncate">{property.title}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Property Images */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="relative">
            {property.images && property.images.length > 0 ? (
              <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="inline-flex gap-2 p-2">
                  {property.images.map((img: any, index: number) => (
                    <img
                      key={img.id}
                      src={img.filePath}
                      alt={`Property ${index + 1}`}
                      className="h-48 w-auto rounded-lg"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No images yet</span>
              </div>
            )}
          </div>

          <div className="p-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {uploading ? "Uploading..." : "Add More Photos"}
            </button>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-semibold text-lg text-gray-900 mb-3">Details</h2>
          <div className="space-y-2 text-gray-700">
            {property.address && (
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 mt-0.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{property.address}, {property.city}, {property.state}</span>
              </div>
            )}

            {property.price && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xl font-bold text-green-600">
                  ${property.price.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex gap-6 text-sm">
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.bedrooms}</span> bed
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.bathrooms}</span> bath
                </div>
              )}
              {property.squareFeet && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{property.squareFeet}</span> sqft
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Content Button */}
        <button
          onClick={handleGenerateContent}
          disabled={generating || !property.images || property.images.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
        >
          {generating ? "🤖 Generating Content..." : "✨ Generate Social Media Posts"}
        </button>

        {/* Generated Content */}
        {property.contents && property.contents.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">Generated Content</h2>
            <div className="space-y-3">
              {property.contents.map((content: any) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-600 uppercase">
                      {content.platform || content.contentType}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(content.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {content.title && (
                    <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                  )}
                  <p className="text-sm text-gray-700 line-clamp-3">{content.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Hint */}
      <div className="fixed bottom-4 left-4 right-4 bg-blue-50 rounded-lg p-3 text-sm text-blue-800 shadow-lg">
        💡 Add photos first, then generate content for all your social media!
      </div>
    </div>
  );
}
