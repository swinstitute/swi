/**
 * ImgBB Image Upload Service
 * Securely uploads images via the server route /api/upload
 * The ImgBB API Key is kept strictly server-side (IMGBB_API_KEY) and never exposed to the client.
 */

export interface ImgBBResponse {
  success: boolean;
  url?: string;
  displayUrl?: string;
  deleteUrl?: string;
  error?: string;
}

export const uploadToImgBB = async (
  fileOrBase64: File | Blob | string
): Promise<ImgBBResponse> => {
  if (typeof window === 'undefined') {
    return {
      success: false,
      error: 'Image uploads can only be initiated from the client.',
    };
  }

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
      return {
        success: true,
        url: serverData.url,
        displayUrl: serverData.displayUrl || serverData.url,
        deleteUrl: serverData.deleteUrl,
      };
    }

    return {
      success: false,
      error: serverData.error || `Upload failed with status ${res.status}`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error occurred during image upload';
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
  imageUrl: string
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
      const res = await uploadToImgBB(imageUrl);
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
      const res = await uploadToImgBB(blob);
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
