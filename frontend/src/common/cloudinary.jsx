import axios from "axios";

export const uploadImage = async (img) => {
    try {
        const formData = new FormData();
        formData.append("image", img);

        const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_DOMAIN}/api/media/image`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!data.uploadURL) throw new Error("Failed to get upload URL.");

        return data.uploadURL;
    } catch (error) {
        console.error("Image upload failed:", error);
        return null;
    }
};
