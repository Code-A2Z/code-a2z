import { useRef } from "react";
import AnimationWrapper from "../../../shared/components/atoms/page-animation";
import InputBox from "../../../shared/components/atoms/input-box";
import { passwordRegex } from "../../../shared/utils/regex";
import { useNotifications } from "../../../shared/hooks/use-notification";
import { changePassword } from "../requests";

const ChangePassword = () => {
  const changePasswordForm = useRef<HTMLFormElement>(null);
  const { addNotification } = useNotifications();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!changePasswordForm.current) return;
    const form = new FormData(changePasswordForm.current);
    const formData: { [key: string]: string } = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value as string;
    }

    const { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      addNotification({
        message: "Please fill all the fields",
        type: "error"
      });
      return;
    }

    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
      addNotification({
        message: "Password should be atleast 6 characters long and contain atleast one uppercase letter, one lowercase letter and one number",
        type: "error"
      });
      return;
    }

    e.currentTarget.setAttribute("disabled", "true");

    changePassword(formData)
      .then(() => {
        e.currentTarget.removeAttribute("disabled");
        return addNotification({
          message: "Password Updated!",
          type: "success"
        });
      })
      .catch(({ response }) => {
        e.currentTarget.removeAttribute("disabled");
        return addNotification({
          message: response.data.error,
          type: "error"
        });
      })
  }

  return (
    <AnimationWrapper>
      <form ref={changePasswordForm} onSubmit={handleSubmit}>
        <h1 className="max-md:hidden">Change Password</h1>

        <div className="py-10 w-full md:max-w-[400px]">
          <InputBox
            name="currentPassword"
            type="password"
            className="profile-edit-input"
            placeholder="Current Password"
            icon="fi-rr-unlock"
          />
          <InputBox
            name="newPassword"
            type="password"
            className="profile-edit-input"
            placeholder="New Password"
            icon="fi-rr-unlock"
          />
          <button type="submit" className="btn-dark px-10">Change Password</button>
        </div>
      </form>
    </AnimationWrapper>
  )
}

export default ChangePassword;
