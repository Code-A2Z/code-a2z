import { useContext, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import SubscribeModal from "./SubscribeModal";
import ThemeToggle from "./ThemeToggle";
import axios from "axios";

const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const searchRef = useRef(null);

    let navigate = useNavigate();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    useEffect(() => {

        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/new", { withCredentials: true })
                .then(({ data }) => {
                    setUserAuth({ ...userAuth, ...data });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [access_token]);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey && event.key === 'k') || (event.ctrlKey && event.key === 'k')) {
                event.preventDefault();
                event.stopPropagation();

                // Check screen width - show mobile-style search for tablet and below
                if (window.innerWidth >= 1024) { // Desktop (lg screens)
                    setTimeout(() => {
                        if (searchRef.current) {
                            searchRef.current.focus();
                            searchRef.current.select();
                        }
                    }, 10);
                } else { // Tablet and mobile 
                    setSearchBoxVisibility(true);
                    setTimeout(() => {
                        if (searchRef.current) {
                            searchRef.current.focus();
                        }
                    }, 100);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    }

    const toggleSubscribeModal = () => {
        setShowSubscribeModal(prev => !prev);
    }

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

                <div className="flex items-center justify-end gap-3 md:gap-6 w-full ">
                    <button
                        className="lg:hidden hover:bg-gray-200 hover:dark:bg-[#27272a] w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
                    >
                        <i className="fi fi-rr-search text-xl text-dark-grey dark:text-gray-400"></i>
                    </button>

                    <ThemeToggle />

                    <Link to="/editor" className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a] p-3 px-4 rounded-lg transition">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notifications">
                                    <button className="w-12 h-12 rounded-full relative text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a]">
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                        {
                                            new_notification_available ?
                                                <span className="bg-red-500 w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                                                : ""
                                        }
                                    </button>
                                </Link>

                                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <button className="w-12 h-12 mt-1">
                                        <img src={profile_img} alt="" className="w-full h-full object-cover rounded-full" />
                                    </button>

                                    {
                                        userNavPanel ?
                                            <UserNavigationPanel />
                                            : null
                                    }
                                </div>
                            </>
                            :
                            <>
                                <button
                                    onClick={toggleSubscribeModal}
                                    className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#27272a] py-2 px-4 rounded-full transition cursor-pointer"
                                >
                                    <i className="fi fi-rr-envelope-plus text-xl"></i>
                                </button>

                                <Link className="bg-black dark:bg-gray-200 text-white dark:text-gray-800 py-2 px-5 rounded-full hover:bg-gray-800 dark:hover:bg-[#ffffff] transition" to="/login">
                                    Login
                                </Link>
                                <Link className="bg-gray-200 dark:bg-black text-gray-800 dark:text-white py-2 px-5 rounded-full hidden md:block hover:bg-gray-300 dark:hover:bg-[#27272a] transition " to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }
                </div>
            </nav>

            {showSubscribeModal && <SubscribeModal onClose={toggleSubscribeModal} />}

            <Outlet />
        </>
    )
}

export default Navbar;