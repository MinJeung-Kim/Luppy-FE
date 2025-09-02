import { getActions, useSelectedGroupId } from '@/stores';
import type { TGroupList } from "@/pages/Messenger/Messenger";
import styles from "./styles.module.css";

type Props = {
  groupList: TGroupList[];
};

export default function GroupList({
  groupList,
}: Props) {
  const selectedGroupId = useSelectedGroupId();
  const { setSelectedGroupId } = getActions()

  return (
    <div className={styles.add_group_container}>
      {groupList.map((group) => (
        <div
          className={`${styles.init_group} ${selectedGroupId === group.id ? styles.selected : ""
            }`}
          key={group.id}
          onClick={() => { setSelectedGroupId(group.id) }}
        >
          {group.emoji}
          <div className={styles.text_container}>
            <span className={styles.title}>{group.name}</span>
            <span className={styles.description}>{group.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
