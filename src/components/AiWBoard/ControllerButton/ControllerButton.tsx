import ToolTipButton from '@/components/common/ToolTipButton/ToolTipButton';
import PencilIcon from '@/components/common/icons/PencilIcon';
import EraserIcon from '@/components/common/icons/EraserIcon';
import CursorIcon from '@/components/common/icons/CursorIcon';
import ColorTextIcon from '@/components/common/icons/ColorTextIcon';
import ColorIcon from '@/components/common/icons/ColorIcon';
import DeleteIcon from '@/components/common/icons/DeleteIcon';
import styles from "./styles.module.css";

export default function ControllerButton() {

    return <div className={styles.controller_button}>
        <ToolTipButton
            Icon={<PencilIcon />}
            onClick={() => { }}
            title="그리기" />

        <ToolTipButton
            Icon={<EraserIcon />}
            onClick={() => { }}
            title="지우기" />

        <ToolTipButton
            Icon={<CursorIcon />}
            onClick={() => { }}
            title="수정" />

        <ToolTipButton
            Icon={<ColorTextIcon />}
            onClick={() => { }}
            title="텍스트" />

        <ToolTipButton
            Icon={<ColorIcon />}
            onClick={() => { }}
            title="색상" />

        <ToolTipButton
            Icon={<DeleteIcon />}
            onClick={() => { }}
            title="전체 삭제" />
    </div>;
}