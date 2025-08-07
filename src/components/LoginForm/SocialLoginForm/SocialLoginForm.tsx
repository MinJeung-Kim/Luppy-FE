import GoogleIcon from "@/assets/icons/Google.svg";
import KakaoIcon from "@/assets/icons/Kakao.svg";
import styles from "./styles.module.css";

const SocialList = [
  {
    icon: GoogleIcon,
    alt: "GoogleIcon",
    text: "Google",
  },
  {
    icon: KakaoIcon,
    alt: "KakaoIcon",
    text: "Kakao",
  },
];

export default function SocialLoginForm() {
  return (
    <ul className={styles.social_login_container}>
      {SocialList.map((item, index) => (
        <li
          key={index}
          className={styles.social_login_item}
          onClick={() => alert(`Login with ${item.text}`)}
        >
          <img src={item.icon} alt={item.alt} className={styles.icon} />
          <span>Login with {item.text} </span>
        </li>
      ))}
    </ul>
  );
}
