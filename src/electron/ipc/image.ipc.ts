import { ipcMain } from "electron";
import { ImageStorageService } from "../services/image-storage.service.js";

export function registerImageIPC(imageStorageService: ImageStorageService) {
  ipcMain.handle(
    "image:create",
    async (_event, input: string): Promise<string | undefined> => {
      return imageStorageService.saveImage(input);
    },
  );
  ipcMain.handle(
    "image:delete",
    async (_event, input: string): Promise<void | undefined> => {
      return imageStorageService.deleteImage(input);
    },
  );
}
