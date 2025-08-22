import styles from "./styles.module.css";

type Props = {
    children: React.ReactNode;
    text: string[];
    position?: "left" | "right" | "top" | "bottom";
};

export default function ToolTip({ children, text, position = "left" }: Props) {
    return (
        <div className={styles.tooltip_wrapper}>
            {children}
            <div className={`${styles.tooltip} ${styles[position]}`}>
                {Array.isArray(text) ? (
                    text.map((line, index) => (
                        <span key={index} className={styles.text}>
                            {line}
                        </span>
                    ))
                ) : (
                    <span className={styles.text}>{text}</span>
                )}
            </div>
        </div>
    );
}
