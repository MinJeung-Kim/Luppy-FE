import BannerImg from "@/assets/images/banner.png";
import styles from "./styles.module.css";

export default function Banner() {
  return (
    <div className={styles.banner_container}>
      <div className={styles.banner_wrap}>
        <h1 className={styles.title}>팀원들이 함께 있어요</h1>
        <span className={styles.sub_title}>
          통화를 잡거나 회의를 시작하고, 반가운 인사로 대화를 열어보세요
        </span>
      </div>
      <img src={BannerImg} alt="Banner Image" className={styles.banner_img} />
    </div>
  );
}
