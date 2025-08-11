import styles from "./styles.module.css";

type Props = {
    src: string;
    alt: string;
}

export default function Avatar({ src, alt }: Props) {

    return (
        <img src={src} alt={alt} className={styles.avatar} />
    );
}