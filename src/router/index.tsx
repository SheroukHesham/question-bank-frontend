import ErrorHandler from "@/errors/ErrorHandler";
import Categories from "@/pages/Categories";
import Exams from "@/pages/Exams";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";

import Questions from "@/pages/Questions";
import PageNotFound from "@/pages/PageNotFound";
import QuestionTypes from "@/pages/QuestionTypes";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import QuestionDetails from "@/pages/QuestionDetails";
import NewQuestion from "@/pages/NewQuestion";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />} path="/" errorElement={<ErrorHandler />}>
        <Route index element={<Home />} />
        <Route path="questions" element={<QuestionTypes />} />
        <Route path="questions/mcq" element={<Questions type="mcq" />} />
        <Route path="questions/essay" element={<Questions type="essay" />} />
        <Route path="questions/:id" element={<QuestionDetails />} />
        <Route path="new_question/:type" element={<NewQuestion />} />

        <Route path="exams" element={<Exams />} />
        <Route path="categories" element={<Categories />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </>,
  ),
);

export default router;
