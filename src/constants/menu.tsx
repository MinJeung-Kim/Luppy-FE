import type { ComponentType, ReactElement } from "react";
import HomeIcon from "@/components/common/icons/HomeIcon";
import MessagesIcon from "@/components/common/icons/MessagesIcon";
import ConferenceIcon from "@/components/common/icons/ConferenceIcon";
import SettingIcon from "@/components/common/icons/SettingIcon";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Messenger from "@/pages/Messenger/Messenger";
import Conference from '@/pages/Conference/Conference';
import BoardIcon from '@/components/common/icons/BoardIcon';
import AiWBoard from '@/pages/AiWBoard/AiWBoard';

export interface MenuItem {
  name: string;
  Icon: ComponentType;
  content: ReactElement;
}

export const MenuItems: MenuItem[] = [
  { name: "Dashboard", Icon: HomeIcon, content: <Dashboard /> },
  { name: "Messenger", Icon: MessagesIcon, content: <Messenger /> },
  {
    name: "Conference",
    Icon: ConferenceIcon,
    content: <Conference />,
  },
  { name: "AI W-Board", Icon: BoardIcon, content: <AiWBoard /> },
  { name: "Management", Icon: SettingIcon, content: <></> },
];
