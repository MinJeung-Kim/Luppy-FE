import { useState } from "react";
import { login } from "@/api/auth";
import { getActions } from '@/stores';
import useUserStore from '@/stores/useUserStore';
import CheckBox from "@/components/common/CheckBox/CheckBox";
import Button from "@/components/common/Button/Button";
import { FORM_MESSAGES } from "@/constants/messages";
import CommonInfoForm from "../CommonInfoForm";
import styles from "./styles.module.css";

export default function EmailLoginForm() {
  const rememberMe = JSON.parse(
    localStorage.getItem("isRememberMe") || "false"
  );
  const { setOpenAlert, setAccessToken, setAlertMessage } = getActions();
  const { user, setUser, isValidInput, isLoading, setIsLoading } = useUserStore();

  const [isRememberMe, setIsRememberMe] = useState(rememberMe);

  const handleLogin = async () => {
    setIsLoading(true);

    if (isRememberMe) {
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("isRememberMe", JSON.stringify(true));
    } else {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isRememberMe");
    }

    const result = await login(user.email, user.password);

    if (!result.error) {
      setAccessToken(result.accessToken);
      setUser(result.user);
    } else {
      setAlertMessage(result.error);
      setOpenAlert(true);
      setIsLoading(false);
    }
  };

  const handleCheckRememberMe = () => {
    console.log('handleCheckRememberMe : ', isRememberMe);

    const newValue = !isRememberMe;
    setIsRememberMe(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValidInput && !isLoading) {
      handleLogin();
    }
  };



  return (
    <div
      className={styles.email_login_container}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <CommonInfoForm />

      <div className={styles.check_box}>
        <CheckBox checked={isRememberMe} onChange={handleCheckRememberMe} />
        <span>Remember me</span>
      </div>
      <Button
        text={
          isLoading ? FORM_MESSAGES.login.loading : FORM_MESSAGES.login.button
        }
        disabled={!isValidInput}
        onClick={handleLogin}
      />
    </div>
  );
}
