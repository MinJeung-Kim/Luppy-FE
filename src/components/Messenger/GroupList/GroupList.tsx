import type { GroupList } from "@/pages/Messenger/Messenger";
import styles from "./styles.module.css";


type Props = {
  groupList: GroupList[];
  selectedGroupId: string;
  onSelect: React.Dispatch<React.SetStateAction<string>>;
};

export default function GroupList({
  groupList,
  selectedGroupId,
  onSelect,
}: Props) {

  return (
    <div className={styles.add_group_container}>
      {groupList.map((group) => (
        <div
          className={`${styles.init_group} ${selectedGroupId === group.id ? styles.selected : ""
            }`}
          key={group.id}
          onClick={() => { onSelect(group.id) }}
        >
          {group.icon}
          <div className={styles.text_container}>
            <span className={styles.title}>{group.title}</span>
            <span className={styles.sub_title}>{group.subTitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
