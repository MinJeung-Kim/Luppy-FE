import styles from "./styles.module.css";

type Props = {
  message: string;
};

export default function ValidationMessage({ message }: Props) {
  return <span className={styles.message}>{message}</span>;
}
