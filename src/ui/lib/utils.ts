import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import type { IpcResult } from "../../shared/ipc-result";

export async function unwrapIpcResult<T>(
  promise: Promise<IpcResult<T>>,
): Promise<T> {
  const result = await promise;
  if (!result.success) {
    throw new Error(result.message, { cause: result.cause });
  }
  return result.data;
}
