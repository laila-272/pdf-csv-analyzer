import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router";
import { createBrowserRouter, Navigate } from "react-router-dom";
import "./App.css";
import "./Categories.css";
import AuthLayout from "./components/auth/AuthLayout.jsx";
import Code from "./components/auth/Code.jsx";
import ForgotPass from "./components/auth/ForgotPass.jsx";
import Login from "./components/auth/Login.jsx";
import PassCode from "./components/auth/PassCode.jsx";
import PassSuccess from "./components/auth/PassSuccess.jsx";
import SetPass from "./components/auth/SetPass.jsx";
import SignUp from "./components/auth/SignUp.jsx";
import Categories from "./components/categories/Categories.jsx";
import CategoryFiles from "./components/categories/CategoryFiles.jsx";
import Chat from "./components/layout/Chat.jsx";
import Dashboard from "./components/dashboard/Dashboard.jsx";
import Home from "./components/dashboard/Home.jsx";
import Search from "./components/layout/Search.jsx";
import CSVColumns from "./components/files/CSVColumns.jsx";
import AuthProvider from "./context/AuthContext.jsx";
import { DragTextProvider } from "./context/DragTextContext.jsx";
import { FileProvider } from "./context/FileContext.jsx";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/Signup" />,
  },

  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Code",
    element: <Code />,
  },
  // {
  //   path: "/Updateprofile",
  //   element: <UpdateProfile />,
  // },
  {
    path: "/Forgotpass",
    element: <ForgotPass />,
  },
  {
    path: "/PassCode",
    element: <PassCode />,
  },
  {
    path: "/Set",
    element: <SetPass />,
  },

  {
    path: "/Passsuccess",
    element: <PassSuccess />,
  },

  {
    path: "/Auth",
    element: <AuthLayout />,
  },
  {
    path: "",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "/home", element: <Home /> },
      { path: "/Categories", element: <Categories /> },
      {
        path: "/category-files/:categoryId/:categoryName",
        element: <CategoryFiles />,
      },
      { path: "/search", element: <Search /> },
      { path: "/Chat", element: <Chat /> },
      { path: "/CSVColumns", element: <CSVColumns /> },
      { path: "/Dashboard", element: <Dashboard /> },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <DragTextProvider>
        <FileProvider>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </FileProvider>
      </DragTextProvider>
    </AuthProvider>
  );
}

export default App;
