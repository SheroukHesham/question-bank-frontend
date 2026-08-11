import ErrorHandler from "@/errors/ErrorHandler";
import Categories from "@/pages/Categories";
import Exams from "@/pages/Exams";
import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import PageNotFound from "@/pages/PageNotFound";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import QuestionDetails from "@/pages/QuestionDetails";
import Questions from "@/pages/Questions";
import CategoryQuestions from "@/pages/CategoryQuestions";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />} path="/" errorElement={<ErrorHandler />}>
        <Route index element={<Home />} />
        <Route path="questions" element={<Questions />} />
        <Route path="question/:id" element={<QuestionDetails />} />

        <Route path="exams" element={<Exams />} />
        <Route path="categories" element={<Categories />} />
        <Route path="category/:id" element={<CategoryQuestions />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </>,
  ),
);

export default router;
