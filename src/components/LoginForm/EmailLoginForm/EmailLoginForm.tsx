import { useState } from "react";
import { login } from "@/api/auth";
import { getActions } from '@/stores';
import { useLogin } from "@/context/LoginContext";
import CheckBox from "@/components/common/CheckBox/CheckBox";
import Button from "@/components/common/Button/Button";
import { FORM_MESSAGES } from "@/constants/messages";
import CommonInfoForm from "../CommonInfoForm";
import styles from "./styles.module.css";

export default function EmailLoginForm() {
  const rememberMe = JSON.parse(
    localStorage.getItem("isRememberMe") || "false"
  );
  const { setUser, setOpenAlert, setAccessToken, setAlertMessage } = getActions();
  const { isValidInput, inputs, isLoading, setIsLoading } = useLogin();

  const [isRememberMe, setIsRememberMe] = useState(rememberMe || false);

  const handleLogin = async () => {
    setIsLoading(true);

    if (isRememberMe) {
      localStorage.setItem("userEmail", inputs.email);
      localStorage.setItem("isRememberMe", JSON.stringify(true));
    } else {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isRememberMe");
    }

    const result = await login(inputs.email, inputs.password);

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
    setIsRememberMe(!isRememberMe);
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
