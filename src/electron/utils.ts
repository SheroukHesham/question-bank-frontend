import { clipboard, nativeImage } from "electron";
import { imageStorageService } from "./services/image-storage.service.js";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

const IMAGE_PROTOCOL_PREFIX = "app-image://";
// If on Electron 44+, use this instead:
import { ClipboardItem } from "electron";

export async function copyManagedImageToClipboard(
  srcURL: string,
): Promise<void> {
  if (!srcURL.startsWith(IMAGE_PROTOCOL_PREFIX)) return;

  const filename = srcURL.slice(IMAGE_PROTOCOL_PREFIX.length);
  const filePath = imageStorageService.resolveImagePath(filename);
  const image = nativeImage.createFromPath(filePath);
  if (image.isEmpty()) return;

  const blob = new Blob([new Uint8Array(image.toPNG())], { type: "image/png" });
  await clipboard.write([new ClipboardItem({ "image/png": blob })]);
}
