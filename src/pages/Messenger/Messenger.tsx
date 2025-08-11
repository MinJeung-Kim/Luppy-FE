import { useState, type ReactNode } from "react";
import { MessengerProvider } from '@/context/MessengerContext';
import GroupList from "@/components/Messenger/GroupList/GroupList";
import AddGroupForm from "@/components/Messenger/AddGroupForm/AddGroupForm";
import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import AllInbox from "@/components/Messenger/AllInbox/AllInbox";
import styles from "./styles.module.css";

export type GroupList = {
  id: string;
  icon: ReactNode;
  title: string;
  subTitle: string;
  content: ReactNode;
};

const GROUP_LIST = [
  {
    id: "all-inbox",
    icon: <CircleUserIcon />,
    title: "All Inbox",
    subTitle: "모든 메세지를 보여줍니다.",
    content: <AllInbox />,
  },
  {
    id: "add-group",
    icon: <PlusCircleIcon />,
    title: "그룹 추가",
    subTitle: "새로운 그룹을 추가합니다.",
    content: <AddGroupForm />,
  },
];
export default function Messenger() {
  const [selectedGroupId, setSelectedGroupId] = useState("all-inbox");


  const selectedGroup = GROUP_LIST.find(
    (group) => group.id === selectedGroupId
  );

  return (
    <div className={styles.messenger_container}>
      <MessengerProvider>
        <GroupList
          groupList={GROUP_LIST}
          selectedGroupId={selectedGroupId}
          onSelect={setSelectedGroupId}
        />
        <div className={styles.content_area}>{selectedGroup?.content}</div>
      </MessengerProvider>
    </div>
  );
}
