import ToolTip from '../ToolTip/ToolTip';
import styles from "./styles.module.css";

type Props = {
    Icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    title: string;
};

export default function ToolTipButton({
    Icon,
    onClick,
    disabled = false,
    title,
}: Props) {
    return (
        <ToolTip text={[title]} position="left">
            <button
                type="button"
                className={`${styles.tool_li} ${disabled ? styles.active : ""}`}
                onClick={onClick}
                disabled={disabled}
            >
                {Icon}
            </button>
        </ToolTip>
    );
}
