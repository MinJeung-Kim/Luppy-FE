import Banner from "@/components/Dashboard/Banner/Banner";
import UpComing from "@/components/Dashboard/UpComing/UpComing";
import QuickActions from "@/components/Dashboard/QuickActions/QuickActions";
import RecentContacts from "@/components/Dashboard/RecentContacts/RecentContacts";
import TopUsers from "@/components/Dashboard/TopUsers/TopUsers";
import styles from "./styles.module.css";

export default function Dashboard() {
  return (
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
  );
}
