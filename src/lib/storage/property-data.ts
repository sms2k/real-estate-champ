import { PropertyData } from "@/types";
import { promises as fs } from "fs";
import path from "path";

const PROPERTY_DATA_DIR = process.env.PROPERTY_DATA_DIR || "./data/properties";

/**
 * Save property data to JSON file
 */
export async function savePropertyData(
  propertyId: string,
  data: PropertyData
): Promise<string> {
  try {
    // Ensure directory exists
    await fs.mkdir(PROPERTY_DATA_DIR, { recursive: true });

    const filePath = path.join(PROPERTY_DATA_DIR, `${propertyId}.json`);

    // Add metadata
    const dataWithMeta = {
      ...data,
      _metadata: {
        lastUpdated: new Date().toISOString(),
        version: "1.0",
      },
    };

    // Write to file
    await fs.writeFile(
      filePath,
      JSON.stringify(dataWithMeta, null, 2),
      "utf-8"
    );

    return filePath;
  } catch (error) {
    console.error("Error saving property data:", error);
    throw error;
  }
}

/**
 * Load property data from JSON file
 */
export async function loadPropertyData(
  propertyId: string
): Promise<PropertyData | null> {
  try {
    const filePath = path.join(PROPERTY_DATA_DIR, `${propertyId}.json`);

    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Remove metadata before returning
    delete data._metadata;

    return data;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return null; // File not found
    }
    console.error("Error loading property data:", error);
    throw error;
  }
}

/**
 * Update property data (merge with existing)
 */
export async function updatePropertyData(
  propertyId: string,
  updates: Partial<PropertyData>
): Promise<PropertyData> {
  try {
    // Load existing data
    const existingData = await loadPropertyData(propertyId);

    // Merge with updates
    const mergedData: PropertyData = {
      basic: {
        ...(existingData?.basic || {}),
        ...(updates.basic || {}),
      } as any,
      features: {
        ...(existingData?.features || {}),
        ...(updates.features || {}),
      } as any,
      narrative: {
        ...(existingData?.narrative || {}),
        ...(updates.narrative || {}),
      } as any,
      images: updates.images || existingData?.images || [],
      chatHistory: [
        ...(existingData?.chatHistory || []),
        ...(updates.chatHistory || []),
      ],
    };

    // Save merged data
    await savePropertyData(propertyId, mergedData);

    return mergedData;
  } catch (error) {
    console.error("Error updating property data:", error);
    throw error;
  }
}

/**
 * Delete property data file
 */
export async function deletePropertyData(propertyId: string): Promise<boolean> {
  try {
    const filePath = path.join(PROPERTY_DATA_DIR, `${propertyId}.json`);
    await fs.unlink(filePath);
    return true;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return false; // File not found
    }
    console.error("Error deleting property data:", error);
    throw error;
  }
}

/**
 * Check if property data exists
 */
export async function propertyDataExists(propertyId: string): Promise<boolean> {
  try {
    const filePath = path.join(PROPERTY_DATA_DIR, `${propertyId}.json`);
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all property data files
 */
export async function getAllPropertyDataFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(PROPERTY_DATA_DIR);
    return files
      .filter(file => file.endsWith(".json"))
      .map(file => path.basename(file, ".json"));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return [];
    }
    console.error("Error reading property data directory:", error);
    throw error;
  }
}

/**
 * Export property data as downloadable JSON
 */
export async function exportPropertyData(
  propertyId: string
): Promise<Buffer> {
  const data = await loadPropertyData(propertyId);

  if (!data) {
    throw new Error("Property data not found");
  }

  return Buffer.from(JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Import property data from JSON
 */
export async function importPropertyData(
  propertyId: string,
  jsonData: string
): Promise<PropertyData> {
  try {
    const data = JSON.parse(jsonData);

    // Validate basic structure
    if (!data.basic || !data.features || !data.narrative) {
      throw new Error("Invalid property data structure");
    }

    await savePropertyData(propertyId, data);

    return data;
  } catch (error) {
    console.error("Error importing property data:", error);
    throw error;
  }
}
