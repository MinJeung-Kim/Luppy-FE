import SectionHeader from "../SectionHeader/SectionHeader";
import MenuIcon from "@/components/common/icons/MenuIcon";
import avatar1 from "@/assets/images/avatar/avatar_1.png";
import avatar2 from "@/assets/images/avatar/avatar_2.png";
import avatar3 from "@/assets/images/avatar/avatar_3.png";
import styles from "./styles.module.css";

const Items = [
  { name: "홍길동", image: avatar1 },
  { name: "김철수", image: avatar2 },
  { name: "이영희", image: avatar3 },
];

export default function RecentContacts() {
  return (
    <div className={styles.recent_contacts_container}>
      <SectionHeader
        title="최근 연락처"
        subTitle="최근에 연락한 사람들을 확인해 보세요"
      />

      <div className={styles.contacts_list}>
        {Items.map((item, index) => (
          <div key={index} className={styles.contact_item}>
            <div className={styles.item_wrap}> 
              <img
                src={item.image}
                alt={item.name}
                className={styles.contact_image}
              />
              <span className={styles.contact_name}>{item.name}</span>
            </div>

            <i className={styles.icon_wrap}>
              <MenuIcon />
            </i>
          </div>
        ))}
      </div>
    </div>
  );
}
