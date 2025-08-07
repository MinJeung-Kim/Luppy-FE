
import { useMessenger } from '@/context/MessengerContext';
import ArrowRightIcon from "@/components/common/icons/ArrowRightIcon";
import ControllerButton from './ControllerButton/ControllerButton';
import FilterIcon from "@/components/common/icons/FilterIcon";
import MenuIcon from "@/components/common/icons/MenuIcon";
import PlusIcon from '@/components/common/icons/PlusIcon';
import styles from "./styles.module.css";

export default function ControllerBox() {
  const { setIsModal } = useMessenger();

  const handleAddChat = () => {
    setIsModal(true);
  }

  return (
    <div className={styles.controller_box_container}>
      <div className={styles.controller_box}>
        <div className={styles.arrow_buttons}>
          <ControllerButton Icon={ArrowRightIcon} onClick={() => { }} />
          <ControllerButton Icon={ArrowRightIcon} onClick={() => { }} />
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
