import { useState } from "react";
import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import type { TGroupItemData } from "./GroupItem/GroupItem";
import GroupItem from "./GroupItem/GroupItem";

type Group = {
  id: string;
  name: string;
  description: string;
};

export default function AddGroup() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const handleAddGroup = () => {
    const groupName = prompt("그룹 이름을 입력하세요:");
    if (groupName && groupName.trim()) {
      const newGroupId = `group-${Date.now()}`;
      const newGroup: Group = {
        id: newGroupId,
        name: groupName.trim(),
        description: `${groupName.trim()} 그룹입니다.`,
      };
      setGroups((prev) => [...prev, newGroup]);
      setActiveItemId(newGroupId);
    }
  };

  const handleGroupClick = (groupId: string) => {
    setActiveItemId(groupId);
  };

  // 고정 아이템들
  const fixedItems: TGroupItemData[] = [
    {
      id: "all-inbox",
      icon: <CircleUserIcon />,
      title: "All Inbox",
      subTitle: "모든 메세지를 보여줍니다.",
      isFixed: true,
      isActive: activeItemId === "all-inbox",
      onClick: () => {
        setActiveItemId("all-inbox");
      },
    },
  ];

  // 동적 그룹 아이템들
  const dynamicGroupItems: TGroupItemData[] = groups.map((group) => ({
    id: group.id,
    icon: <CircleUserIcon />,
    title: group.name,
    subTitle: group.description,
    isFixed: false,
    isActive: activeItemId === group.id,
    onClick: () => handleGroupClick(group.id),
  }));

  // 그룹 추가 버튼
  const addGroupItem: TGroupItemData = {
    id: "add-group",
    icon: <PlusCircleIcon />,
    title: "그룹 추가",
    subTitle: "새로운 그룹을 추가합니다.",
    isFixed: true,
    isActive: activeItemId === "add-group",
    onClick: () => {
      setActiveItemId("add-group");
      handleAddGroup();
    },
  };

  // 전체 아이템 순서: 고정 아이템 → 동적 그룹들 → 그룹 추가 버튼
  const allItems = [...fixedItems, ...dynamicGroupItems, addGroupItem];

  return (
    < >
      {allItems.map((item) => (
        <GroupItem key={item.id} data={item} />
      ))}
    </>
  );
}
