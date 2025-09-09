import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/InputBox";
import { toast, Toaster } from 'react-hot-toast';
import axios from "axios";
import { UserContext } from "../App";

const ChangePassword = () => {

    let { userAuth: { access_token } } = useContext(UserContext);

    let changePasswordForm = useRef<HTMLFormElement>(null);

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(changePasswordForm.current!);
        let formData: { [key: string]: any } = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { currentPassword, newPassword } = formData;

        if (!currentPassword.length || !newPassword.length) {
            toast.error("Please fill all the fields");
        }

        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be atleast 6 characters long and contain atleast one uppercase letter, one lowercase letter and one number");
        }

        e.target.setAttribute("disabled", true);

        let loadingToast = toast.loading("Changing password...");

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/auth/change-password", formData, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
            .then(() => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.success("Password Updated!");
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                return toast.error(response.data.error);
            })
    }

    return (
        <AnimationWrapper>
            <Toaster />

            <form ref={changePasswordForm}>

                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value=""
                        placeholder="Current Password"
                        icon="fi-rr-unlock"
                    />
                    <InputBox
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value=""
                        placeholder="New Password"
                        icon="fi-rr-unlock"
                    />

                    <button onClick={handleSubmit} type="submit" className="btn-dark px-10">Change Password</button>
                </div>

            </form>
        </AnimationWrapper>
    )
}

export default ChangePassword;
