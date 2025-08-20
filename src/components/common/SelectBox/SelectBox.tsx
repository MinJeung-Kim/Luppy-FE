import styles from "./styles.module.css";

type Props = {
    options: { label: string; value: string }[];
    onClick: (value: string) => void;
}

export default function SelectBox({ options, onClick }: Props) {

    return <ul className={styles.select_box}>
        {options.map(({ label, value }, index) => (
            <li key={index} className={styles.select_item} onClick={() => onClick?.(value)}>{label}</li>
        ))}
    </ul>;
}