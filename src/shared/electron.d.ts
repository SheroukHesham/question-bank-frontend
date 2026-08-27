import type { ICategory } from "./interfaces";
import type { ICreateMcqQuestion, IMcqQuestion } from "./question";

export {};

declare global {
  interface Window {
    electron: {
      questions: {
        createMcq(input: ICreateMcqQuestion): Promise<IMcqQuestion>;
      };
      categories: {
        create(name: string): Promise<ICategory>;
      };
    };
  }
}
