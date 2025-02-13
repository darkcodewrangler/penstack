/**
 * Resolves and combines base URL and path segments into a proper URL
 * Handles cases like:
 * - Base URLs with or without trailing slashes
 * - Paths with or without leading/trailing slashes
 * - Multiple consecutive slashes
 * - Empty or undefined path segments
 *
 * @param baseUrl - The base URL (e.g., 'https://github.com')
 * @param paths - One or more path segments to append
 * @returns A properly formatted URL
 */
export function resolveUrl(baseUrl: string, ...paths: (string | undefined)[]) {
  try {
    // Clean the base URL
    let cleanBaseUrl = baseUrl.trim();

    // Ensure the base URL has a valid protocol
    if (
      !cleanBaseUrl.startsWith("http://") &&
      !cleanBaseUrl.startsWith("https://")
    ) {
      cleanBaseUrl = `https://${cleanBaseUrl}`;
    }

    // Remove trailing slash from base URL
    cleanBaseUrl = cleanBaseUrl.replace(/\/+$/, "");

    // Filter out undefined/null paths and clean the remaining ones
    const cleanPaths = paths
      .filter((path): path is string => !!path)
      .map((path) => {
        // Remove leading and trailing slashes and clean up multiple consecutive slashes
        return path
          .trim()
          .replace(/^\/+|\/+$/g, "")
          .replace(/\/+/g, "/");
      })
      .filter((path) => path.length > 0); // Remove empty strings after cleaning

    // Combine base URL with paths
    if (cleanPaths.length === 0) {
      return cleanBaseUrl;
    }

    return `${cleanBaseUrl}/${cleanPaths.join("/")}`;
  } catch (error) {
    throw new Error(
      `Failed to resolve URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Validates if a string is a valid URL
 *
 * @param url - URL string to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Extracts the base URL from a full URL
 *
 * @param url - Full URL string
 * @returns Base URL (protocol + hostname)
 */
export function getBaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.hostname}`;
  } catch {
    throw new Error("Invalid URL provided");
  }
}
export function getSiteUrl() {
  if (typeof window !== "undefined") {
    return ""; // Return empty string on client-side
  }

  // On server side
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}
