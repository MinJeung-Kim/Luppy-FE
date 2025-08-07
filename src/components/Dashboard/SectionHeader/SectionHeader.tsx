import styles from "./styles.module.css";

type Props = { title: string; subTitle: string };

export default function SectionHeader({ title, subTitle }: Props) {
  return (
    <div className={styles.section_wrap}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.sub_title}>{subTitle}</span>
    </div>
  );
}
