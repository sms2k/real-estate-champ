/**
 * WordPress API Integration
 * Connects the PWA to the WordPress plugin REST API endpoints
 */

const WORDPRESS_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';

interface WordPressResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Make authenticated request to WordPress API
 */
async function wordpressRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<WordPressResponse<T>> {
  try {
    const url = `${WORDPRESS_URL}/wp-json/real-estate-champ/v1${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('WordPress API error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Properties API
 */
export const propertiesAPI = {
  getAll: async () => {
    return wordpressRequest('/properties');
  },

  get: async (id: string) => {
    return wordpressRequest(`/properties/${id}`);
  },

  create: async (data: any) => {
    return wordpressRequest('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return wordpressRequest(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return wordpressRequest(`/properties/${id}`, {
      method: 'DELETE',
    });
  },

  uploadImages: async (propertyId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file_${index}`, file);
    });

    return wordpressRequest(`/properties/${propertyId}/images`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type with boundary
    });
  },
};

/**
 * Chat API
 */
export const chatAPI = {
  send: async (messages: Array<{ role: string; content: string }>, propertyId?: string) => {
    return wordpressRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages, property_id: propertyId }),
    });
  },
};

/**
 * Content Generation API
 */
export const contentAPI = {
  generate: async (propertyId: string, platforms: string[]) => {
    return wordpressRequest(`/properties/${propertyId}/generate-content`, {
      method: 'POST',
      body: JSON.stringify({ platforms }),
    });
  },

  publish: async (contentId: string) => {
    return wordpressRequest(`/content/${contentId}/publish`, {
      method: 'POST',
    });
  },
};

/**
 * Social Accounts API
 */
export const socialAPI = {
  getAccounts: async () => {
    return wordpressRequest('/social-accounts');
  },

  connect: async (platform: string, accountData: any) => {
    return wordpressRequest('/social-accounts', {
      method: 'POST',
      body: JSON.stringify({ platform, ...accountData }),
    });
  },
};

/**
 * Settings API
 */
export const settingsAPI = {
  get: async () => {
    return wordpressRequest('/settings');
  },
};

/**
 * Sync API (for offline support)
 */
export const syncAPI = {
  sync: async (data: any) => {
    return wordpressRequest('/sync', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Check if WordPress is configured
 */
export function isWordPressConfigured(): boolean {
  return !!WORDPRESS_URL && WORDPRESS_URL.length > 0;
}

/**
 * Get WordPress URL
 */
export function getWordPressURL(): string {
  return WORDPRESS_URL;
}
