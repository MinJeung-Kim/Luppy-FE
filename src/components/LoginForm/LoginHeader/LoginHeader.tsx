import { useLogin } from "@/context/LoginContext";
import styles from "./styles.module.css";

type Props = { title?: string; subTitle?: string };

export default function LoginHeader({ title, subTitle }: Props) {
  const { isLogin } = useLogin();

  return (
    <div className={styles.login_header}>
      <span>{title} </span>
      <span className={isLogin ? styles.title : styles.sub_title}>
        {subTitle}
      </span>
    </div>
  );
}
