import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { UserAtom } from '../../../states/user';

const Sidebar = () => {
  const user = useAtomValue(UserAtom);
  const page = location.pathname.split('/')[2];

  const [pageState, setPageState] = useState(page.replace('-', ' '));
  const [showSideNav, setShowSideNav] = useState(false);

  const activeTabLine = useRef<HTMLHRElement>(null);
  const sideBarIconTab = useRef<HTMLButtonElement>(null);
  const pageStateTab = useRef<HTMLButtonElement>(null);

  const changePageState = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const { offsetWidth, offsetLeft } = e.currentTarget;
    if (!activeTabLine?.current) return;
    activeTabLine.current.style.width = offsetWidth + 'px';
    activeTabLine.current.style.left = offsetLeft + 'px';

    if (e.target === sideBarIconTab.current) {
      setShowSideNav(true);
    } else {
      setShowSideNav(false);
    }
  };

  useEffect(() => {
    setShowSideNav(false);
    if (pageStateTab.current) {
      pageStateTab.current.click();
    }
  }, [pageState]);

  if (!user || !user?.access_token) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
      <div className="sticky top-[80px] z-30">
        <div className="md:hidden bg-[#fafafa] dark:bg-[#09090b] py-1 border-b border-gray-100 flex flex-nowrap overflow-x-auto">
          <button
            onClick={changePageState}
            ref={sideBarIconTab}
            className="p-5 capitalize"
          >
            <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
          </button>
          <button
            onClick={changePageState}
            ref={pageStateTab}
            className="p-5 capitalize"
          >
            {pageState}
          </button>

          <hr ref={activeTabLine} className="absolute botton-0 duration-500" />
        </div>

        <div
          className={
            'min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-r md:border-gray-100 dark:md:border-gray-800 absolute max-md:top-[64px] bg-[#fafafa] dark:bg-[#09090b] max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ' +
            (!showSideNav
              ? 'max-md:opacity-0 max-md:pointer-events-none'
              : 'opacity-100 pointer-events-auto')
          }
        >
          <h1 className="text-xl text-gray-500 dark:text-gray-400 mb-3">
            Dashboard
          </h1>
          <hr className="border-gray-100 dark:border-gray-800 -ml-6 mb-8 mr-6" />

          <NavLink
            to="/dashboard/projects"
            onClick={e => setPageState(e.currentTarget.innerText)}
            className="sidebar-link"
          >
            <i className="fi fi-rr-document"></i>
            Projects
          </NavLink>
          <NavLink
            to="/dashboard/notifications"
            onClick={e => setPageState(e.currentTarget.innerText)}
            className="sidebar-link"
          >
            <div className="relative">
              <i className="fi fi-rr-bell"></i>
              {user?.new_notification_available ? (
                <span className="bg-red-500 w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
              ) : (
                ''
              )}
            </div>
            Notification
          </NavLink>
          <NavLink
            to="/editor"
            onClick={e => setPageState(e.currentTarget.innerText)}
            className="sidebar-link"
          >
            <i className="fi fi-rr-file-edit"></i>
            Write
          </NavLink>

          <h1 className="text-xl text-gray-500 dark:text-gray-400 mt-20 mb-3">
            Settings
          </h1>
          <hr className="border-gray-100 dark:border-gray-800 -ml-6 mb-8 mr-6" />

          <NavLink
            to="/settings/edit-profile"
            onClick={e => setPageState(e.currentTarget.innerText)}
            className="sidebar-link"
          >
            <i className="fi fi-rr-user"></i>
            Edit Profile
          </NavLink>
          <NavLink
            to="/settings/change-password"
            onClick={e => setPageState(e.currentTarget.innerText)}
            className="sidebar-link"
          >
            <i className="fi fi-rr-lock"></i>
            Change Password
          </NavLink>
        </div>
      </div>

      <div className="max-md:-mt-8 mt-5 w-full">
        <Outlet />
      </div>
    </section>
  );
};

export default Sidebar;
