import type { ComponentType } from "react";
import HomeIcon from "@/components/common/icons/HomeIcon";
import MessagesIcon from "@/components/common/icons/MessagesIcon";
import ConferenceIcon from "@/components/common/icons/ConferenceIcon";
import SettingIcon from "@/components/common/icons/SettingIcon";
import BoardIcon from '@/components/common/icons/BoardIcon';

export interface MenuItem {
  name: string;
  Icon: ComponentType;
  url: string;
}

export const MenuItems: MenuItem[] = [
  { name: "Dashboard", Icon: HomeIcon, url: "/" },
  { name: "Messenger", Icon: MessagesIcon, url: "/messenger" },
  {
    name: "Conference",
    Icon: ConferenceIcon,
    url: "/conference",
  },
  { name: "AI W-Board", Icon: BoardIcon, url: "/ai-w-board" },
  { name: "Management", Icon: SettingIcon, url: "/management" },
];
