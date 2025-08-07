import ClockIcon from "@/components/common/icons/ClockIcon";
import SectionTemplate from "../SectionTemplate/SectionTemplate";
import styles from "./styles.module.css";

const Items = [
  { time: "오전 10:00", title: "팀 회의" },
  { time: "오후 2:00", title: "프로젝트 업데이트" },
  { time: "오후 4:00", title: "클라이언트 통화" },
];

export default function UpComing() {
  return (
    <SectionTemplate
      title="곧 다가오는 일정"
      subTitle="팀원들과의 통화나 회의 일정을 확인하세요"
    >
      <div className={styles.upcoming_list}>
        {Items.map((item, index) => (
          <div key={index} className={styles.upcoming_item}>
            <div className={styles.icon_wrap}>
              <ClockIcon />
            </div>
            <span className={styles.item_time}>{item.time}</span>
            <span className={styles.item_title}>{item.title}</span>
          </div>
        ))}
      </div>
    </SectionTemplate>
  );
}
