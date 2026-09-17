import { IpcResult } from "@/shared/ipc-result.js";
import { ipcMain, type IpcMainInvokeEvent } from "electron";

export function safeHandle<TArgs extends unknown[], TResult>(
  channel: string,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: TArgs
  ) => TResult | Promise<TResult>,
) {
  ipcMain.handle(
    channel,
    async (event, ...args: TArgs): Promise<IpcResult<TResult>> => {
      try {
        const data = await handler(event, ...args);
        return { success: true, data };
      } catch (error) {
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          cause:
            error instanceof Error
              ? (error.cause as string)
              : "Unexpected Cause",
        };
      }
    },
  );
}
