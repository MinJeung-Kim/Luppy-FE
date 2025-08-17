import { useState, useMemo, type ReactNode } from "react";
import { MessengerProvider } from '@/context/MessengerContext';
import GroupList from "@/components/Messenger/GroupList/GroupList";
import AddGroupForm from "@/components/Messenger/AddGroupForm/AddGroupForm";
import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import AllInbox from "@/components/Messenger/AllInbox/AllInbox";
import styles from "./styles.module.css";
import { useQuery } from '@tanstack/react-query';
import { getGroupList, type TGroup } from '@/api/chat';

export type TGroupList = {
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

  // data (TGroup[]) 를 0번째(static) 이후, 마지막(add-group) 이전에 삽입
  const mergedGroupList: TGroupList[] = useMemo(() => {
    const dynamicGroups: TGroupList[] = (data || []).map(g => ({
      id: `group-${g.id}`,
      icon: <span>{g.emoji}</span>,
      title: g.name,
      subTitle: g.description,
      content: <div>{g.name}</div>, // TODO: 그룹 상세/채팅 컴포넌트로 교체
    }));

    console.log('data : ', data);

    // GROUP_LIST[0] = All Inbox, GROUP_LIST[GROUP_LIST.length-1] = add-group
    if (GROUP_LIST.length < 2) return [...GROUP_LIST, ...dynamicGroups];
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
