import LogoImg from "@/assets/images/logo.png";
import styles from "./styles.module.css";
import Menu from "./Menu/Menu";
import UserMenu from "./UserMenu/UserMenu";

export default function Header() {
  return (
    <div className={styles.header_container}>
      <div className={styles.logo_warp}>
        <img className={styles.logo_img} src={LogoImg} alt="logo" />
        <div className={styles.logo_text}>
          <span className={styles.logo_sub}>Happy</span>
          <span className={styles.logo}>Luppy</span>
        </div>
      </div>

      <Menu />
      <UserMenu />
    </div>
  );
}
