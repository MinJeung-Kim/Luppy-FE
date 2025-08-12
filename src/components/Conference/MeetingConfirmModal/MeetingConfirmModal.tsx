import { getActions } from '@/stores';
import Modal from '@/components/common/Modal/Modal';
import styles from "./styles.module.css";

type Props = {
    text: string
}

export default function MeetingConfirmModal({ text }: Props) {
    const { setIsGlobalModal } = getActions();

    const handleSave = () => { }

    return <Modal
        header='화상 회의 초대'
        onClose={() => { setIsGlobalModal(false) }}
        onSave={handleSave}  >
        <div className={styles.meeting_modal_container}>
            <div className={styles.host_wrap}>
                <span className={styles.host_name}>{text}</span>
                <span className={styles.title}> 님이 회의실에 초대했습니다.</span>
            </div>
            <span className={styles.sub_title}>회의에 참여하시겠습니까?</span>
        </div>
    </Modal>;
}