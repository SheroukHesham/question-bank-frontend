import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { app } from "electron";

export class ImageStorageService {
  private readonly imagesDir: string;

  constructor() {
    this.imagesDir = path.join(app.getPath("userData"), "question-images");
    fs.mkdirSync(this.imagesDir, { recursive: true });
  }

  saveImage(sourcePath: string): string {
    const ext = path.extname(sourcePath);
    const generatedFilename = `${crypto.randomUUID()}${ext}`;
    fs.copyFileSync(sourcePath, path.join(this.imagesDir, generatedFilename));
    return generatedFilename;
  }

  deleteImage(filename: string | null | undefined): void {
    if (!filename) return;
    const filePath = this.resolveImagePath(filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  resolveImagePath(filename: string): string {
    const safeName = path.basename(filename);
    return path.join(this.imagesDir, safeName);
  }
}

export const imageStorageService = new ImageStorageService();
