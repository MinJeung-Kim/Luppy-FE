import { useMessenger } from '@/context/MessengerContext';
import ArrowRightIcon from "@/components/common/icons/ArrowRightIcon";
import ControllerButton from './ControllerButton/ControllerButton';
import FilterIcon from "@/components/common/icons/FilterIcon";
import MenuIcon from "@/components/common/icons/MenuIcon";
import PlusIcon from '@/components/common/icons/PlusIcon';
import styles from "./styles.module.css";

export default function ControllerBox() {
  const {
    setIsModal,
    currentPage,
    setCurrentPage,
    totalPages
  } = useMessenger();

  const handleAddChat = () => {
    setIsModal(true);
  }


  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }

  return (
    <div className={styles.controller_box_container}>
      <div className={styles.controller_box}>
        <div className={styles.arrow_buttons}>
          <ControllerButton Icon={ArrowRightIcon}
            onClick={handlePrevPage}
            disabled={currentPage === 1} />
          <span className={styles.page_info}>{currentPage} / {totalPages}</span>
          <ControllerButton Icon={ArrowRightIcon}
            onClick={handleNextPage}
            disabled={currentPage === totalPages} />
        </div>
        <div className={styles.action_buttons}>
          <ControllerButton Icon={FilterIcon} onClick={() => { }} />
          <ControllerButton Icon={MenuIcon} onClick={() => { }} />
        </div>
      </div>

      <ControllerButton Icon={PlusIcon} onClick={handleAddChat} />
    </div>
  );
}
