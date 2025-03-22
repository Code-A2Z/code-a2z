// root packages 
import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

// common files 
import { lookInSession } from "./common/session";

// components files 
import Navbar from "./components/navbar.component";
import SideNav from "./components/sideNavBar.component";

// pages files 
import UserAuthForm from "./pages/UserAuthForm.page";
import Editor from "./pages/Editor.page";
import Home from "./pages/Home.page";
import SearchPage from "./pages/Search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/Profile.page";
import ProjectPage from "./pages/Project.page";
import ChangePassword from "./pages/ChangePassword.page";
import EditProfile from "./pages/EditProfile.page";
import Notifications from "./pages/Notifications.page";
import ManageProjects from "./pages/ManageProjects.page";

export const UserContext = createContext({});

function App() {

  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
  }, [])

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
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
  )
}

export default App;
