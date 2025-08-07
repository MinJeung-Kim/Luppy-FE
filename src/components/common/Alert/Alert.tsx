import { useEffect, useCallback } from "react";
import { getActions, useAlertMessage } from "@/stores";
import Button from "../Button/Button";
import styles from "./styles.module.css";

/**
 * Alert 컴포넌트는 서버에서 사용자에게 보낸 알림 메시지를 표시하는 컴포넌트입니다.
 * 알림 메시지는 5초 후 자동으로 닫히며, 사용자가 "확인" 버튼을 클릭하여 수동으로 닫을 수도 있습니다.
 */
export default function Alert() {
  const alertMessage = useAlertMessage();
  const { setOpenAlert } = getActions();

  const handleClose = useCallback(() => {
    setOpenAlert(false);
  }, [setOpenAlert]);

  useEffect(() => {
    const timer = setTimeout(handleClose, 5000);
    return () => clearTimeout(timer);
  }, [handleClose]);

  return (
    <div className={styles.alert_container} onClick={handleClose}>
      <div className={styles.alert_wrap}>
        <span className={styles.text}>{alertMessage}</span>
        <Button text="확인" onClick={handleClose} />
      </div>
    </div>
  );
}
