import { useState } from "react";

interface InputBoxProps {
    name: any;
    type: any;
    id: any;
    value: any;
    placeholder: any;
    icon: any;
    disable?: boolean;
}

const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }: InputBoxProps) => {

    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="relative w-[100%] mb-4">
            <input
                name={name}
                type={type == "password" ? passwordVisible ? "text" : "password" : type}
                placeholder={placeholder}
                defaultValue={value}
                id={id}
                disabled={disable}
                className="input-box"
            />

            <i className={"fi " + icon + " input-icon"}></i>

            {
                type == "password" ?
                    <i className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "") + " input-icon left-[auto] right-4 cursor-pointer"}
                        onClick={() => setPasswordVisible(!passwordVisible)}
                    ></i>
                    : ""
            }
        </div>
    )
}

export default InputBox;
