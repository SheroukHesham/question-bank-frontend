export type IpcResult<T> =
  | { success: true; data: T }
  | { success: false; message: string; cause: string };
