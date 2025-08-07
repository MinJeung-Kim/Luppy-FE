import SectionTemplate from "../SectionTemplate/SectionTemplate";
import styles from "./styles.module.css";

const QuickMenu = [
  { name: "화상회의를 시작해 보세요", Icon: "phone" },
  { name: "회의 일정을 생성해 보세요", Icon: "calendar" },
  { name: "실시간 메시지로 소통해 보세요", Icon: "message" },
];

export default function QuickActions() {
  return (
    <SectionTemplate
      title="Quick Actions"
      subTitle="즐겨찾는 메뉴를 등록해 보세요"
    >
      {QuickMenu.map((item) => (
        <div key={item.name} className={styles.quick_action_item}>
          <i className={`icon-${item.Icon}`}></i>
          <span className={styles.name}>{item.name}</span>
        </div>
      ))}
    </SectionTemplate>
  );
}
