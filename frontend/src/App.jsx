import { Route, Routes, Suspense, useMemo } from "react-router-dom";
import { createContext, useEffect, useState, memo, lazy } from "react";
import { lookInSession } from "./common/session";
import { 
  LazyHome, 
  LazyProfile, 
  LazyProject, 
  LazyEditor, 
  LazySearch, 
  LazyNotifications, 
  LazyManageProjects, 
  LazyEditProfile, 
  LazyChangePassword 
} from "./utils/lazyLoader";
import { usePerformanceMonitor } from "./utils/usePerformance";
import Loader from "./components/Loader";
import PerformanceDashboard from "./components/PerformanceDashboard";

// Lazy load components that are not immediately needed
const LazyNavbar = lazy(() => import("./components/Navbar"));
const LazySideNav = lazy(() => import("./components/SideNavBar"));
const LazyUserAuthForm = lazy(() => import("./pages/UserAuthForm"));
const LazyPageNotFound = lazy(() => import("./pages/404"));

export const UserContext = createContext({});

// Memoized App component to prevent unnecessary re-renders
const App = memo(() => {
  const [userAuth, setUserAuth] = useState({});
  
  // Performance monitoring
  usePerformanceMonitor('App');

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ userAuth, setUserAuth }), [userAuth]);

  return (
    <UserContext.Provider value={contextValue}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/editor" element={<LazyEditor />} />
          <Route path="/editor/:project_id" element={<LazyEditor />} />
          <Route path="/" element={<LazyNavbar />}>
            <Route index element={<LazyHome />} />
            <Route path="dashboard" element={<LazySideNav />}>
              <Route path="projects" element={<LazyManageProjects />} />
              <Route path="notifications" element={<LazyNotifications />} />
            </Route>
            <Route path="settings" element={<LazySideNav />}>
              <Route path="edit-profile" element={<LazyEditProfile />} />
              <Route path="change-password" element={<LazyChangePassword />} />
            </Route>
            <Route path="login" element={<LazyUserAuthForm type="login" />} />
            <Route path="signup" element={<LazyUserAuthForm type="signup" />} />
            <Route path="search/:query" element={<LazySearch />} />
            <Route path="user/:id" element={<LazyProfile />} />
            <Route path="project/:project_id" element={<LazyProject />} />
            <Route path="*" element={<LazyPageNotFound />} />
          </Route>
        </Routes>
      </Suspense>
      <PerformanceDashboard />
    </UserContext.Provider>
  );
});

App.displayName = 'App';

export default App;
