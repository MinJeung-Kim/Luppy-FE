import clsx from "clsx";
import { useMessenger } from '@/context/MessengerContext';
import { getActions, useSelectedGroupId } from '@/stores';
import type { TGroupList } from "@/pages/Messenger/Messenger";
import styles from "./styles.module.css";

type Props = {
  groupList: TGroupList[];
};

export default function GroupList({ groupList }: Props) {
  const selectedGroupId = useSelectedGroupId();
  const { setSelectedGroupId } = getActions();
  const { setSelectedChat } = useMessenger();

  const handleClickGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setSelectedChat(null);
  }

  return (
    <div className={styles.add_group_container}>
      {groupList.map((group) => {
        const isSelected = selectedGroupId === group.id;

        return (
          <div
            className={clsx(styles.init_group, {
              [styles.selected]: isSelected
            })}
            key={group.id}
            onClick={() => { handleClickGroup(group.id) }}
          >
            {group.emoji}
            <div className={styles.text_container}>
              <span className={styles.title}>{group.name}</span>
              <span className={styles.description}>{group.desc}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
