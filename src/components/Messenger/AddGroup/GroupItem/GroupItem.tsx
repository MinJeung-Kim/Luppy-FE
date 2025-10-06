import type { ReactNode } from "react";
import styles from "./styles.module.css";

export type TGroupItem = {
  id: string;
  icon: ReactNode;
  title: string;
  subTitle: string;
};

export default function GroupItem(props: TGroupItem) {

  const {
    icon,
    title,
    subTitle,
  } = props;

  return (
    <div
      className={styles.init_group}
      role="button"
      tabIndex={0}
    >
      {icon}
      <div className={styles.text_container}>
        <span className={styles.title}>{title}</span>
        <span className={styles.sub_title}>{subTitle}</span>
      </div>
    </div>
  );
}
