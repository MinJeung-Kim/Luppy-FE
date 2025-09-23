import Menu from "./Menu/Menu";
import UserMenu from "./UserMenu/UserMenu";
import LogoImg from "@/assets/images/logo.png";
import styles from "./styles.module.css";
import { useUser } from '@/stores';

export default function Header() {
  const user = useUser();
  return (
    <div className={styles.header_container}>
      <div className={styles.logo_warp}>
        <img className={styles.logo_img} src={LogoImg} alt="logo" />
        <div className={styles.logo_text}>
          <span className={styles.logo_sub}>Happy</span>
          <span className={styles.logo}>Luppy</span>
        </div>
        <span>{user?.name}</span>
      </div>

      <Menu />
      <UserMenu />

    </div>
  );
}
