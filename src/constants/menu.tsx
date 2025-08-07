import type { ComponentType, ReactElement } from "react";
import HomeIcon from "@/components/common/icons/HomeIcon";
import MessagesIcon from "@/components/common/icons/MessagesIcon";
import ConferenceIcon from "@/components/common/icons/ConferenceIcon";
import CalendarIcon from "@/components/common/icons/CalendarIcon";
import SettingIcon from "@/components/common/icons/SettingIcon";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Messenger from "@/pages/Messenger/Messenger";

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
    content: <></>,
  },
  { name: "Schedule", Icon: CalendarIcon, content: <></> },
  { name: "Management", Icon: SettingIcon, content: <></> },
];
