import { Dispatch, SetStateAction, useState } from "react";

interface InputBoxProps {
  name: string;
  type: string;
  id?: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  icon: string;
  autoComplete?: "on" | "off";
  disable?: boolean;
  className?: string;
}

const InputBox = ({
  name,
  type,
  id,
  value,
  setValue,
  placeholder,
  icon,
  autoComplete = "on",
  disable = false,
  className,
}: InputBoxProps) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className={className + " relative w-[100%] mb-4"}>
      <input
        name={name}
        type={
          type == "password" ? (passwordVisible ? "text" : "password") : type
        }
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className="input-box"
        onChange={(e) => setValue?.(e.target.value)}
        autoComplete={autoComplete}
      />

      <i className={"fi " + icon + " input-icon"}></i>

      {type == "password" ? (
        <i
          className={
            "fi fi-rr-eye" +
            (!passwordVisible ? "-crossed" : "") +
            " input-icon left-[auto] right-4 cursor-pointer"
          }
          onClick={() => setPasswordVisible(!passwordVisible)}
        ></i>
      ) : (
        ""
      )}
    </div>
  );
};

export default InputBox;
