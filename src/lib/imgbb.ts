/**
 * ImgBB Image Upload Service
 * Uploads images via secure server endpoint /api/upload (or direct fallback if key provided)
 */

export interface ImgBBResponse {
  success: boolean;
  url?: string;
  displayUrl?: string;
  deleteUrl?: string;
  error?: string;
}

export const uploadToImgBB = async (
  fileOrBase64: File | Blob | string,
  apiKey?: string
): Promise<ImgBBResponse> => {
  // If in browser and no explicit apiKey override provided, use secure server route /api/upload
  if (typeof window !== 'undefined' && !apiKey) {
    try {
      const serverFormData = new FormData();
      if (typeof fileOrBase64 === 'string') {
        serverFormData.append('image', fileOrBase64);
      } else if (fileOrBase64 instanceof File) {
        serverFormData.append('image', fileOrBase64);
      } else {
        serverFormData.append('image', fileOrBase64, 'upload.jpg');
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: serverFormData,
      });

      const serverData = await res.json();
      if (res.ok && serverData.success) {
        return serverData;
      }
      // If server route reports an error, fallback to client if key exists
    } catch {
      // Fallback
    }
  }

  try {
    const key = apiKey || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!key) {
      return {
        success: false,
        error: 'No ImgBB API key found. Please configure your ImgBB API key in server environment variables or Studio Settings.',
      };
    }

    const formData = new FormData();
    formData.append('key', key);

    if (typeof fileOrBase64 === 'string') {
      // Strips data URL prefix if present for clean base64 payload
      const cleanBase64 = fileOrBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      formData.append('image', cleanBase64);
    } else if (fileOrBase64 instanceof File) {
      formData.append('image', fileOrBase64);
    } else {
      formData.append('image', fileOrBase64, 'upload.jpg');
    }

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data && data.success) {
      return {
        success: true,
        url: data.data.url,
        displayUrl: data.data.display_url || data.data.url,
        deleteUrl: data.data.delete_url,
      };
    } else {
      return {
        success: false,
        error: data?.error?.message || 'Failed to upload image to ImgBB',
      };
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred while uploading to ImgBB';
    return {
      success: false,
      error: message,
    };
  }
};

/**
 * Syncs any image (local URL, relative path, or Base64 data URL) to ImgBB CDN.
 * If the image is already hosted on ImgBB CDN (e.g. ibb.co), returns original URL.
 */
export const syncImageToImgBB = async (
  imageUrl: string,
  apiKey?: string
): Promise<{ url: string; uploaded: boolean; error?: string }> => {
  if (!imageUrl || imageUrl.trim() === '') {
    return { url: '', uploaded: false };
  }

  // Already hosted on ImgBB CDN
  if (imageUrl.includes('ibb.co') || imageUrl.includes('imgbb.com')) {
    return { url: imageUrl, uploaded: false };
  }

  try {
    // If it's a Base64 Data URL
    if (imageUrl.startsWith('data:image/')) {
      const res = await uploadToImgBB(imageUrl, apiKey);
      if (res.success && (res.displayUrl || res.url)) {
        return { url: res.displayUrl || res.url || imageUrl, uploaded: true };
      }
      return { url: imageUrl, uploaded: false, error: res.error };
    }

    // If it's a relative URL or accessible image URL, fetch as blob in browser
    if (typeof window !== 'undefined') {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        return { url: imageUrl, uploaded: false, error: `Failed to fetch image: ${response.statusText}` };
      }
      const blob = await response.blob();
      const res = await uploadToImgBB(blob, apiKey);
      if (res.success && (res.displayUrl || res.url)) {
        return { url: res.displayUrl || res.url || imageUrl, uploaded: true };
      }
      return { url: imageUrl, uploaded: false, error: res.error };
    }

    return { url: imageUrl, uploaded: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error syncing image';
    console.warn('Error syncing image to ImgBB:', message);
    return { url: imageUrl, uploaded: false, error: message };
  }
};
