import SectionHeader from "../SectionHeader/SectionHeader";
import styles from "./styles.module.css";

type Props = { title: string; subTitle: string; children: React.ReactNode };

export default function SectionTemplate({ title, subTitle, children }: Props) {
  return (
    <div className={styles.section_container}>
      <SectionHeader title={title} subTitle={subTitle} />
      {children}
    </div>
  );
}
