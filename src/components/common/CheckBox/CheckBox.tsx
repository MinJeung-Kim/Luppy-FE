import styles from "./styles.module.css";

type Props = {
  name?: string;
  checked: boolean;
  onChange: () => void;
};

export default function CheckBox({ name = "check", checked, onChange }: Props) {
  return (
    <div className={styles.checkbox_container}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={name} className={styles.check_box}></label>
    </div>
  );
}
