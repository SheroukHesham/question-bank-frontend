import ErrorHandler from "@/ui/errors/ErrorHandler";
import Categories from "@/ui/pages/Categories";
import Exams from "@/ui/pages/Exams";
// import Home from "@/pages/Home";
import Layout from "@/ui/pages/Layout";
import PageNotFound from "@/ui/pages/PageNotFound";
import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Questions from "@/ui/pages/Questions";
import CategoryQuestions from "@/ui/pages/CategoryQuestions";
import CreateExam from "@/ui/pages/CreateExam";
import Login from "@/ui/pages/Login";
import { ProtectedRoute } from "@/ui/auth/ProtectedRoute";

const router = createHashRouter(
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
