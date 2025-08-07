import styles from "./styles.module.css";

type Props = {
  type?: "etc" | "save";
  text?: string;
  Icon?: React.ComponentType;
  disabled?: boolean;
  onClick: () => void;
};

export default function Button({
  type = "save",
  text,
  Icon,
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
      className={`
        ${styles.button_container} 
        ${getTypeClass()} 
        ${disabled ? styles.disabled : ""
        }`}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon />}
      {text}
    </button>
  );
}
