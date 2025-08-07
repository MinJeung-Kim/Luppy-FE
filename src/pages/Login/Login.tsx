import { Helmet } from "react-helmet-async";
import LoginImg from "@/assets/images/login.png";
import { LOGIN_PAGE_META } from "@/constants/page_messages";
import LoginForm from "@/components/LoginForm/LoginForm";
import { LoginProvider } from "@/context/LoginContext";
import styles from "./styles.module.css";

export default function Login() {
  return (
    <>
      <Helmet>
        <title>{LOGIN_PAGE_META.title}</title>
        <meta name="description" content={LOGIN_PAGE_META.description} />
        <meta property="og:title" content={LOGIN_PAGE_META.ogTitle} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.login_container}>
        <div className={styles.login_img}>
          <img src={LoginImg} alt={LOGIN_PAGE_META.imageAlt} />
        </div>
        <LoginProvider>
          <LoginForm />
        </LoginProvider>
      </div>
    </>
  );
}
