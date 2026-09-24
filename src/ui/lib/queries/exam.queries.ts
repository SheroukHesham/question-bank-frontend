import { examKeys } from "./keys";

export const examQueries = {
  findAll: () => ({
    queryKey: examKeys.findAll(),
    queryFn: () => window.electron.exam.findAllExams(),
  }),
};
