import type { ChangeEvent, FocusEvent } from "react";
import styles from "./styles.module.css";

type Props = {
  type?: "text" | "password" | "email";
  name: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  isLabel?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  type = "text",
  name,
  value,
  placeholder,
  disabled = false,
  isLabel = true,
  onChange,
  onBlur,
}: Props) {
  return (
    <div className={styles.text_input_container}>
      {isLabel && <label className={styles.label}>{name}</label>}
      <input
        className={`${styles.input} ${disabled ? styles.disabled : ""}`}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
}
