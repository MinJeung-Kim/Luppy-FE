import useUserStore from '@/stores/useUserStore';
import { LOGIN_MESSAGES } from "@/constants/messages";
import EmailLoginForm from "./EmailLoginForm/EmailLoginForm";
import SocialLoginForm from "./SocialLoginForm/SocialLoginForm";
import LoginHeader from "./LoginHeader/LoginHeader";
import Register from "./Register";
import styles from "./styles.module.css";

export default function LoginForm() {
  const { toggleIsLogin, isLogin } = useUserStore();

  const title = isLogin
    ? LOGIN_MESSAGES.header.loginTitle
    : LOGIN_MESSAGES.header.registerTitle;

  const subTitle = isLogin
    ? LOGIN_MESSAGES.header.loginSubTitle
    : LOGIN_MESSAGES.header.registerSubTitle;

  const toggleText = isLogin
    ? LOGIN_MESSAGES.toggleForm.toRegisterPrompt
    : LOGIN_MESSAGES.toggleForm.toLoginPrompt;

  const toggleBtn = isLogin
    ? LOGIN_MESSAGES.toggleForm.registerBtn
    : LOGIN_MESSAGES.toggleForm.loginBtn;

  return (
    <section className={styles.login_form_container}>
      <LoginHeader title={title} subTitle={subTitle} />

      {isLogin ? (
        <>
          <SocialLoginForm />
          <span className={styles.or}>{LOGIN_MESSAGES.separator}</span>
          <EmailLoginForm />
        </>
      ) : (
        <Register />
      )}

      <span className={styles.change_form}>
        {toggleText}
        <span className={styles.register_btn} onClick={toggleIsLogin}>
          {toggleBtn}
        </span>
      </span>
    </section>
  );
}
