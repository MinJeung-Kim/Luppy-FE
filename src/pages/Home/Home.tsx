import { Helmet } from "react-helmet-async";
import { useSelectedMenu } from "@/stores";
import { HOME_PAGE_META } from "@/constants/page_messages";
import MediaMenu from '@/components/Header/MediaMenu/MediaMenu';
import Header from "@/components/Header/Header";
import { MenuItems } from "@/constants/menu";
import styles from "./styles.module.css";

export default function Home() {
  const selectedMenu = useSelectedMenu();

  // 선택된 메뉴에 해당하는 컴포넌트 찾기
  const currentMenuItem = MenuItems.find((item) => item.name === selectedMenu);
  const currentContent = currentMenuItem?.content || (
    <div>컴포넌트를 찾을 수 없습니다.</div>
  );

  return (
    <>
      <Helmet>
        <title>{HOME_PAGE_META.title}</title>
        <meta name="description" content={HOME_PAGE_META.description} />
        <meta property="og:title" content={HOME_PAGE_META.ogTitle} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.home_container}>
        <MediaMenu />
        <Header />
        {currentContent}
      </div>
    </>
  );
}
