import ErrorHandler from "@/errors/ErrorHandler";
import Categories from "@/pages/Categories";
import Exams from "@/pages/Exams";
// import Home from "@/pages/Home";
import Layout from "@/pages/Layout";
import PageNotFound from "@/pages/PageNotFound";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Questions from "@/pages/Questions";
import CategoryQuestions from "@/pages/CategoryQuestions";
import CreateExam from "@/pages/CreateExam";
import Login from "@/pages/Login";
import { ProtectedRoute } from "@/auth/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />} path="/" errorElement={<ErrorHandler />}>
          {/* <Route index element={<Home />} /> */}
          {/* <Route  path="questions" element={<Questions />} /> */}
          <Route index element={<Questions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="category/:id" element={<CategoryQuestions />} />
          <Route path="exams" element={<Exams />} />
          <Route path="exams/new/:type" element={<CreateExam />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </>,
  ),
);

export default router;
