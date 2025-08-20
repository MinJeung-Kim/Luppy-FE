import { useState, useMemo, type ReactNode } from "react";
import { useQuery } from '@tanstack/react-query';
import { getGroupList, type TGroup } from '@/api/chat';
import { MessengerProvider } from '@/context/MessengerContext';
import GroupList from "@/components/Messenger/GroupList/GroupList";
import AddGroupForm from "@/components/Messenger/AddGroupForm/AddGroupForm";
import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import AllInbox from "@/components/Messenger/AllInbox/AllInbox";
import styles from "./styles.module.css";
import { getActions } from '@/stores';

export type TGroupList = {
  id: string;
  emoji: ReactNode;
  name: string;
  description: string;
  content: ReactNode;
};

const GROUP_LIST = [
  {
    id: "all-inbox",
    emoji: <CircleUserIcon />,
    name: "All Inbox",
    description: "모든 메세지를 보여줍니다.",
    content: <AllInbox />,
  },
  {
    id: "add-group",
    emoji: <PlusCircleIcon />,
    name: "그룹 추가",
    description: "새로운 그룹을 추가합니다.",
    content: <AddGroupForm />,
  },
];

export default function Messenger() {
  const [selectedGroupId, setSelectedGroupId] = useState("all-inbox");
  const { setChatGroupList } = getActions()

  const { data } = useQuery<TGroup[]>({
    queryKey: ['groupList'],
    queryFn: async () => {
      const result = await getGroupList();
      if (result?.error) {
        throw new Error(result.error);
      }

      return result?.groupList || [];
    },
  })

  const mergedGroupList: TGroupList[] = useMemo(() => {
    const dynamicGroups: TGroupList[] = (data || []).map(g => ({
      id: `${g.id}`,
      emoji: <span>{g.emoji}</span>,
      name: g.name,
      description: g.description,
      content: <div>{g.name}</div>, // TODO: 그룹 상세/채팅 컴포넌트로 교체
    }));

    if (GROUP_LIST.length < 2) return [...GROUP_LIST, ...dynamicGroups];
    setChatGroupList(dynamicGroups);
    return [GROUP_LIST[0], ...dynamicGroups, ...GROUP_LIST.slice(1)];
  }, [data]);

  const selectedGroup = mergedGroupList.find(
    (group) => group.id === selectedGroupId
  );

  return (
    <div className={styles.messenger_container}>
      <MessengerProvider>
        <GroupList
          groupList={mergedGroupList}
          selectedGroupId={selectedGroupId}
          onSelect={setSelectedGroupId}
        />
        <div className={styles.content_area}>{selectedGroup?.content}</div>
      </MessengerProvider>
    </div>
  );
}
