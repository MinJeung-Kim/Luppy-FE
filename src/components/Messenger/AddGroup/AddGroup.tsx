import { useState } from "react";
import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import type { TGroupItemData } from "./GroupItem/GroupItem";
import GroupItem from "./GroupItem/GroupItem";

export default function AddGroup() {
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

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
    },
  };

  const allItems = [...fixedItems, addGroupItem];

  return (
    <>
      {allItems.map((item) => (
        <GroupItem key={item.id} data={item} />
      ))}
    </>
  );
}
