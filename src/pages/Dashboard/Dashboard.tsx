import { Helmet } from "react-helmet-async";
import { HOME_PAGE_META } from '@/constants/page_messages';
import Banner from "@/components/Dashboard/Banner/Banner";
import UpComing from "@/components/Dashboard/UpComing/UpComing";
import QuickActions from "@/components/Dashboard/QuickActions/QuickActions";
import RecentContacts from "@/components/Dashboard/RecentContacts/RecentContacts";
import TopUsers from "@/components/Dashboard/TopUsers/TopUsers";
import styles from "./styles.module.css";

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>{HOME_PAGE_META.title}</title>
        <meta name="desc" content={HOME_PAGE_META.desc} />
        <meta property="og:title" content={HOME_PAGE_META.ogTitle} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className={styles.dashboard_container}>
        <div className={styles.dashboard_wrap}>
          <Banner />
          <div className={styles.content}>
            <UpComing />
            <div className={styles.right}>
              <QuickActions />
              <TopUsers />
            </div>
          </div>
        </div>
        <RecentContacts />
      </div>
    </>
  );
}
