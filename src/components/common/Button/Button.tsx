import styles from "./styles.module.css";

type Props = {
  type?: "etc" | "save";
<<<<<<< HEAD
  text: string;
=======
  text?: string;
  Icon?: React.ComponentType;
>>>>>>> messenger
  disabled?: boolean;
  onClick: () => void;
};

export default function Button({
  type = "save",
  text,
<<<<<<< HEAD
=======
  Icon,
>>>>>>> messenger
  disabled = false,
  onClick,
}: Props) {
  const getTypeClass = () => {
    switch (type) {
      case "save":
        return styles.save;
      case "etc":
        return styles.etc;
      default:
        return styles.save;
    }
  };

  return (
    <button
<<<<<<< HEAD
      className={`${styles.button_container} ${getTypeClass()} ${
        disabled ? styles.disabled : ""
      }`}
=======
      className={`${styles.button_container} ${getTypeClass()} ${disabled ? styles.disabled : ""
        }`}
>>>>>>> messenger
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon />}
      {text}
    </button>
  );
}
