import BarChart from "@/components/common/BarChart";
import SectionTemplate from "../SectionTemplate/SectionTemplate";
// import styles from "./styles.module.css";

export default function TopUsers() {
  return (
    <SectionTemplate title="Top Users" subTitle="Top 10 users by activity">
      <BarChart />
    </SectionTemplate>
  );
}
