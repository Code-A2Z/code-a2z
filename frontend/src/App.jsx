import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import SearchPage from "./pages/Search";
import PageNotFound from "./pages/404";
import ProfilePage from "./pages/Profile";
import ProjectPage from "./pages/Project";
import SideNav from "./components/SideNavBar";
import ChangePassword from "./pages/ChangePassword";
import EditProfile from "./pages/EditProfile";
import Notifications from "./pages/Notifications";
import ManageProjects from "./pages/ManageProjects";
import QRCodeReaderPage from "./components/QRReader";

export const UserContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        {/* ✅ QR Reader as a standalone top-level route */}
        <Route path="/qr-reader" element={<QRCodeReaderPage />} />

        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:project_id" element={<Editor />} />

        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />

          <Route path="dashboard" element={<SideNav />}>
            <Route path="projects" element={<ManageProjects />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="settings" element={<SideNav />}>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>

          <Route path="login" element={<UserAuthForm type="login" />} />
          <Route path="signup" element={<UserAuthForm type="signup" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="project/:project_id" element={<ProjectPage />} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;

