import CloseIcon from "../icons/CloseIcon";
import styles from "./styles.module.css";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
  header?: string;
};

export default function Modal({ children, onClose, header, onSave }: Props) {
  return (
    <div className={styles.modal_overlay}>
      <div className={styles.modal_container}>
        {header && (
          <div className={styles.modal_header} onClick={onClose}>
            <span className={styles.header}>{header}</span>
            <i className={styles.close_icon}>
              <CloseIcon />
            </i>
          </div>
        )}
        <div className={styles.modal_content}>{children}</div>

        <div className={styles.modal_footer}>
          <button className={styles.cancel_button} onClick={onClose}>취소</button>
          <button className={styles.ok_button} onClick={onSave}>확인</button>
        </div>
      </div>
    </div>
  );
}
