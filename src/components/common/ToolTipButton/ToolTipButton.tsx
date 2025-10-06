import clsx from "clsx";
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
                className={clsx(styles.tool_li, { [styles.active]: disabled })}
                onClick={onClick}
                disabled={disabled}
            >
                {Icon}
            </button>
        </ToolTip>
    );
}
