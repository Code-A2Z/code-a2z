import { useContext, useEffect, useState } from "react";
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

    let navigate = useNavigate();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    useEffect(() => {

        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/new", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
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
                    <img src="/logo.png" alt="" className="w-full dark:invert" />
                </Link>

                <div
                    className={"absolute bg-[#fafafa] dark:bg-[#09090b] w-full left-0 top-full mt-0.5 border-b border-gray-200 dark:border-[#27272a] py-4 px-[5vw] md:border-0 md:relative md:inset-0 md:p-0 md:w-auto " +
                        (searchBoxVisibility ? "show" : "hidden md:block")}
                >
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-[#ffffff] dark:bg-[#18181b] p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey dark:placeholder:text-gray-400 md:pl-12"
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey dark:text-gray-400"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-[#ffffff] dark:bg-[#18181b] w-12 h-12 rounded-full flex items-center justify-center" onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}>
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
                                    <button className="w-12 h-12 rounded-full bg-gray-200 relative hover:bg-black/10">
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
                                <Link className="bg-gray-200 dark:bg-black text-gray-800 dark:text-white py-2 px-5 rounded-full hidden md:block hover:bg-gray-300 dark:hover:bg-[#27272a] transition" to="/signup">
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
