import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useAtom } from 'jotai';
import { UserAtom } from './shared/states/user'; 
import Navbar from './shared/components/molecules/navbar';
import CANotifications from './shared/components/molecules/notifications';
import Home from './modules/home';
import FeedbackForm from './feedbackForm/feedbackForm';
import UserAuthForm from './modules/user-auth-form';
import PageNotFound from './modules/404';
import Search from './modules/search';
import Profile from './modules/profile';
import Project from './modules/project';
import Editor from './modules/editor';
import Sidebar from './shared/components/molecules/sidebar';
import ChangePassword from './modules/user-auth-form/change-password';
import EditProfile from './modules/profile/edit-profile';
import ManageProjects from './modules/project/manage-projects';
import Notifications from './modules/notification';

function App() {
  const [userAuth, setUserAuth] = useAtom(UserAtom);

  useEffect(() => {
    // Check if user is authenticated
    if (userAuth) {
      // User is authenticated, you can fetch user data or perform other actions
    } else {
      // User is not authenticated, redirect to login or show appropriate UI
      setUserAuth(prev => ({ ...prev, access_token: '' }));
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

        <Route />
      
      
       
      


          <Route path="dashboard" element={<Sidebar />}>
            <Route path="projects" element={<ManageProjects />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="feedback" element={<FeedbackForm />} /> 
          </Route>
          <Route path="settings" element={<Sidebar />}>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
        </Route>
        
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:project_id" element={<Editor />} />


        <Route path="*" element={<PageNotFound />} />
      </Routes>
       

      <CANotifications />
    </>

  );

 


}

export default App;
