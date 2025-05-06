import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import InputBox from "./InputBox";

const SubscribeModal = ({ onClose }) => {

    const handleSubscribe = (e) => {
        e.preventDefault();

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        let form = new FormData(subscribeFormEle);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { email } = formData;

        if (!email.length) {
            return toast.error("Email is required");
        }

        if (!emailRegex.test(email)) {
            return toast.error("Please enter a valid email");
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/subscriber/subscribe", { email })
            .then(() => {
                toast.success("Thanks for subscribing to our newsletter!");
                setTimeout(() => {
                    onClose();
                }, 1000);
            })
            .catch(({ response }) => {
                console.error("Subscription error:", response.data.error);
                toast.error(response.data.error);
            })
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
            <Toaster />

            <form id="subscribeFormEle" className="bg-white dark:bg-black rounded-lg max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black dark:text-white py-3 px-4 rounded-full hover:bg-gray-100 hover:dark:bg-[#1f1f23] transition"
                >
                    <i className="fi fi-rr-cross text-xl"></i>
                </button>

                <h2 className="text-2xl font-bold mb-2">Subscribe to Newsletter</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Stay updated with our latest articles, projects, and announcements.
                </p>

                <div className="relative mb-6">
                    <InputBox
                        name="email"
                        type="email"
                        placeholder="Your email address"
                        icon="fi-rr-envelope"
                    />
                </div>

                <button onClick={handleSubscribe} className="btn-dark w-full">
                    Subscribe
                </button>
            </form>
        </div>
    );
};

export default SubscribeModal;
