import { RouterProvider } from "react-router-dom";
import router from "./router";

//todo:make question form responsive on small screen
//todo: test responsiveness of entire system

function App() {
  return <RouterProvider router={router} />;
}

export default App;
