import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MuiThemeProvider from './shared/components/molecules/theme';
import A2ZNotifications from './shared/components/molecules/notification';
import Navbar from './shared/components/organisms/navbar';
import { setupTokenRefresh } from './shared/utils/api-interceptor';
import { useEffect } from 'react';
import Home from './modules/home';
import UserAuthForm from './modules/user-auth-form';
import Editor from './modules/editor';
import PageNotFound from './modules/404';
import Search from './modules/search';
import Profile from './modules/profile';
import Project from './modules/project';
import Sidebar from './shared/components/organisms/sidebar';
// import ChangePassword from "./modules/change-password";
import ManageProjects from './modules/manage-projects';
// import EditProfile from "./modules/edit-profile";
// import Notifications from "./modules/notification";

function App() {
  useEffect(() => {
    setupTokenRefresh();
  }, []);

  return (
    <MuiThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />
            <Route path="login" element={<UserAuthForm type="login" />} />
            <Route path="signup" element={<UserAuthForm type="signup" />} />
            <Route path="search/:query" element={<Search />} />
            <Route path="user/:username" element={<Profile />} />
            <Route path="project/:project_id" element={<Project />} />

            <Route path="dashboard" element={<Sidebar />}>
              <Route path="projects" element={<ManageProjects />} />
              {/* <Route path="notifications" element={<Notifications />} /> */}
            </Route>
            <Route path="settings" element={<Sidebar />}>
              {/* <Route path="edit-profile" element={<EditProfile />} /> */}
              {/* <Route path="change-password" element={<ChangePassword />} /> */}
            </Route>
          </Route>

          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:project_id" element={<Editor />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>

        <A2ZNotifications />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
