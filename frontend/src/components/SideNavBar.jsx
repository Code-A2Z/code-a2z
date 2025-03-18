import { Outlet } from "react-router-dom";

const SideNav = () => {
    return (
        <>
            <h1>Side navbar</h1>
            <Outlet />
        </>
    )
}

export default SideNav;
