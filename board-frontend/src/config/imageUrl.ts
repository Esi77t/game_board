import { API_BASE_URL } from "./api";

export const getImageUrl = (imagePath: string | null): string | null => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    return `${API_BASE_URL}${imagePath}`;
}