import React from 'react';
import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import SubscribeModal from "./SubscribeModal";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";
import { removeFromSession } from "../common/session";


const Navbar = () => {
    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);
    const searchRef = useRef(null);

    const navigate = useNavigate();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    useEffect(() => {
        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/new", {
                headers: { Authorization: `Bearer ${access_token}` }
            })
            .then(({ data }) => setUserAuth({ ...userAuth, ...data }))
            .catch(console.log);
        }
    }, [access_token]);

    const handleUserNavPanel = () => setUserNavPanel(prev => !prev);
    const toggleSubscribeModal = () => setShowSubscribeModal(prev => !prev);
    const toggleSignOutModal = () => setShowSignOutModal(prev => !prev);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({ access_token: null });
        toggleSignOutModal();
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && e.target.value.length) {
            navigate(`/search/${e.target.value}`);
        }
    };

    return (
        <>
            <nav className="navbar z-50">
                <Link to="/" className="flex-none w-10">
                    <img src="/logo.png" alt="" className="w-full rounded-md" />
                </Link>
<div
    className={`absolute bg-[#fafafa] dark:bg-[#09090b] w-full left-0 top-full mt-0.5 border-b border-gray-200 dark:border-[#27272a] py-4 px-[5vw] lg:border-0 lg:relative lg:inset-0 lg:p-0 ${
        searchBoxVisibility ? "block" : "hidden lg:block"
    }`}
>
    <input
        type="text"
        placeholder={searchBoxVisibility ? "Search" : "Press Ctrl+K"}
        id="search-bar"
        ref={searchRef}
        className="w-full lg:w-58 bg-[#ffffff] dark:bg-[#18181b] p-4 pl-6 pr-[12%] lg:pr-6 rounded-full placeholder:text-dark-grey dark:placeholder:text-gray-400 lg:pl-12 transition-all duration-300 focus:lg:w-96"
        onKeyDown={handleSearch}
        onFocus={() => setSearchBoxVisibility(true)}
        onBlur={() => {
            if (window.innerWidth < 1024) {
                setSearchBoxVisibility(false);
            }
        }}
    />
    <i className="fi fi-rr-search absolute right-[10%] lg:pointer-events-none lg:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey dark:text-gray-400"></i>
</div>
                <div className="flex items-center justify-end gap-3 md:gap-6 w-full">
                    <button
                        className="lg:hidden hover:bg-gray-200 hover:dark:bg-[#27272a] w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
                    >
                        <i className="fi fi-rr-search text-xl text-dark-grey dark:text-gray-400"></i>
                    </button>

                    <ThemeToggle />
                    <Link to="/editor" className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a] p-3 px-4 rounded-lg transition">
                        <i className="fi fi-rr-file-edit"></i> Write
                    </Link>

                    {access_token ? (
                        <>
                            <Link to="/dashboard/notifications">
                                <button className="w-12 h-12 rounded-full relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a]">
                                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                    {new_notification_available && <span className="bg-red-500 w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>}
                                </button>
                            </Link>

                            <div className="relative">
                                <button className="w-12 h-12 mt-1" onClick={handleUserNavPanel}>
                                    <img src={profile_img} alt="" className="w-full h-full object-cover rounded-full" />
                                </button>
                                {userNavPanel && (
                                    <UserNavigationPanel 
                                        username={userAuth.username} 
                                        toggleSignOutModal={toggleSignOutModal} 
                                        signOutUser={signOutUser} 
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={toggleSubscribeModal} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a] py-2 px-4 rounded-full transition cursor-pointer">
                                <i className="fi fi-rr-envelope-plus text-xl"></i>
                            </button>
                            <Link to="/login" className="bg-black dark:bg-gray-200 text-white dark:text-gray-800 py-2 px-5 rounded-full hover:bg-gray-800 dark:hover:bg-[#ffffff] transition">Login</Link>
                            <Link to="/signup" className="bg-gray-200 dark:bg-black text-gray-800 dark:text-white py-2 px-5 rounded-full hidden md:block hover:bg-gray-300 dark:hover:bg-[#27272a] transition">Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

{showSubscribeModal && <SubscribeModal onClose={toggleSubscribeModal} />}

{showSignOutModal && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 relative shadow-2xl border border-gray-200 dark:border-gray-700 transform scale-95 animate-modalAppear">
      <button
        onClick={toggleSignOutModal}
        className="absolute top-4 right-4 text-gray-800 dark:text-gray-200 py-2 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <i className="fi fi-rr-cross text-xl"></i>
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Confirm Sign Out
      </h2>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        Are you sure you want to sign out, @{userAuth.username}?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={toggleSignOutModal}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
        <button
          onClick={signOutUser}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
)}

            <Outlet />
        </>
    );
};

export default Navbar;