/**
 * Image compression/resize helpers for upload and scan
 * Reduces payload size and improves API performance
 */
import { Image } from 'react-native';
import { IMAGE_CONFIG } from '@constants';

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Get image dimensions without loading full resolution
 */
export function getImageDimensions(uri: string): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      reject,
    );
  });
}

/**
 * Compute scaled dimensions to fit within MAX_WIDTH x MAX_HEIGHT
 * Preserves aspect ratio; call before upload/compress
 */
export function getScaledDimensions(
  width: number,
  height: number,
): ImageDimensions {
  const maxW = IMAGE_CONFIG.MAX_WIDTH;
  const maxH = IMAGE_CONFIG.MAX_HEIGHT;
  if (width <= maxW && height <= maxH) return { width, height };
  const ratio = Math.min(maxW / width, maxH / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}
