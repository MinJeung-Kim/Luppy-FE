import CircleUserIcon from "@/components/common/icons/CircleUserIcon";
import PlusCircleIcon from "@/components/common/icons/PlusCircleIcon";
import GroupItem, { type TGroupItem } from "./GroupItem/GroupItem";

export default function AddGroup() {

  // 고정 아이템들
  const fixedItems: TGroupItem[] = [
    {
      id: "all-inbox",
      icon: <CircleUserIcon />,
      title: "All Inbox",
      subTitle: "모든 메세지를 보여줍니다.",
    },
  ];


  // 그룹 추가 버튼
  const addGroupItem: TGroupItem = {
    id: "add-group",
    icon: <PlusCircleIcon />,
    title: "그룹 추가",
    subTitle: "새로운 그룹을 추가합니다.",
  };

  const allItems = [...fixedItems, addGroupItem];

  return (
    <>
      {allItems.map((item) => (
        <GroupItem key={item.id} {...item} />
      ))}
    </>
  );
}
