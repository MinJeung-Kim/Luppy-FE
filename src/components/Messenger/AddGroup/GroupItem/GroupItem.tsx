import type { ReactNode } from "react";
import styles from "./styles.module.css";

export type GroupItemData = {
  id: string;
  icon: ReactNode;
  title: string;
  subTitle: string;
  onClick?: () => void;
  isFixed?: boolean; // 고정 아이템 여부 (All Inbox, 그룹 추가 버튼)
  isActive?: boolean; // 활성화 상태
};

type Props = {
  data: GroupItemData;
};

export default function GroupItem({ data }: Props) {
  const handleClick = () => {
    data.onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      data.onClick?.();
    }
  };

  return (
    <div
      className={`${styles.init_group} ${data.isActive ? styles.action : ""}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {data.icon}
      <div className={styles.text_container}>
        <span className={styles.title}>{data.title}</span>
        <span className={styles.sub_title}>{data.subTitle}</span>
      </div>
    </div>
  );
}
