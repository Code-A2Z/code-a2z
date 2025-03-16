import { useState } from "react";

const CommentField = ({ action }) => {

    const [comment, setComment] = useState('');

    return (
        <>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Leave a comment..."
                className="input-box pl-5 placeholder:text-gray-500 resize-none h-[150px] overflow-auto"
            >
            </textarea>
            <button className="btn-dark mt-5 px-10">{action}</button>
        </>
    );
}

export default CommentField;
