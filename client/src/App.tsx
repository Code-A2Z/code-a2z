import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAtom } from "jotai";
import { UserAtom } from "./shared/states/user";
import Navbar from "./shared/components/molecules/navbar";
import CANotifications from "./shared/components/molecules/notifications";
import Home from "./modules/home";
import UserAuthForm from "./modules/user-auth-form";
import PageNotFound from "./modules/404";
import Search from "./modules/search";
import Profile from "./modules/profile";
import Project from "./modules/project";
import Editor from "./modules/editor";
import Sidebar from "./shared/components/molecules/sidebar";

function App() {
  const [userAuth, setUserAuth] = useAtom(UserAtom);

  useEffect(() => {
    // Check if user is authenticated
    if (userAuth) {
      // User is authenticated, you can fetch user data or perform other actions
    } else {
      // User is not authenticated, redirect to login or show appropriate UI
      setUserAuth({
        access_token: null,
      });
    }
  }, [userAuth, setUserAuth]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="login" element={<UserAuthForm type="login" />} />
          <Route path="signup" element={<UserAuthForm type="signup" />} />
          <Route path="search/:query" element={<Search />} />
          <Route path="user/:id" element={<Profile />} />
          <Route path="project/:project_id" element={<Project />} />

          <Route path="dashboard" element={<Sidebar />}>
          </Route>
          <Route path="settings" element={<Sidebar />}>
          </Route>

        </Route>

        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:project_id" element={<Editor />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>

      <CANotifications />
    </>
  )
}

export default App;
