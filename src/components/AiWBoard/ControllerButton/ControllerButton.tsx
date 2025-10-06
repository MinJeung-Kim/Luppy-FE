import { useState } from 'react';
import * as fabric from "fabric";
import { getActions, useCanvas, useColor, useSelectedTool } from '@/stores';
import ColorTextIcon from '@/components/common/icons/ColorTextIcon';
import ToolTipButton from '@/components/common/ToolTipButton/ToolTipButton';
import PencilIcon from '@/components/common/icons/PencilIcon';
import EraserIcon from '@/components/common/icons/EraserIcon';
import CursorIcon from '@/components/common/icons/CursorIcon';
import DeleteIcon from '@/components/common/icons/DeleteIcon';
import ColorPanel from '../ColorPanel/ColorPanel';
import styles from "./styles.module.css";

export default function ControllerButton() {
    const canvas = useCanvas();
    const activeColor = useColor();
    const selectedTool = useSelectedTool();
    const { setSelectedTool } = getActions()

    const [isPanelOpen, setIsPanelOpen] = useState(true);

    const switchButton = (tool: string) => {
        if (!(canvas instanceof fabric.Canvas)) return;

        switch (tool) {
            case "그리기": {
                canvas.isDrawingMode = true;
                setIsPanelOpen(prev => !prev)
                break;
            }
            case "지우기": {
                canvas.isDrawingMode = false;
                const handleMouseUp = (target: fabric.Object | undefined) => {
                    if (!target) return;
                    canvas.remove(target);
                };

                const handleSelectionCreated = (selected: fabric.Object[] | undefined) => {

                    selected?.forEach((object) => canvas.remove(object));
                    canvas.discardActiveObject();
                    canvas.renderAll();
                };

                canvas.on("mouse:up", ({ target }) => handleMouseUp(target));

                canvas.on("selection:created", ({ selected }) =>
                    handleSelectionCreated(selected)
                );
                break;
            }
            case "수정": {
                canvas.isDrawingMode = false;
                canvas.selection = true;
                break;
            }
            case "텍스트": {
                canvas.isDrawingMode = false;
                const text = new fabric.IText("텍스트를 입력하세요", {
                    left: 100,
                    top: 100,
                    fontFamily: "arial",
                    fill: activeColor,
                    fontSize: 20,
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                break;
            }
            case "전체 삭제": {
                canvas.clear();
                break;
            }
            default:
                break;
        }
    }

    const handleToolChange = (tool: string) => {
        setSelectedTool(tool);
        switchButton(tool);
        if (tool !== "그리기") {
            setIsPanelOpen(false);
        }
    };

    const TOOLS = [
        { Icon: <PencilIcon />, title: "그리기" },
        { Icon: <EraserIcon />, title: "지우기" },
        { Icon: <CursorIcon />, title: "수정" },
        { Icon: <ColorTextIcon />, title: "텍스트" },
        { Icon: <DeleteIcon />, title: "전체 삭제" },
    ]

    return (
        <div className={styles.controller_button}>
            {TOOLS.map(({ Icon, title }) => (
                <div key={title} className={selectedTool === title ? styles.selected : ""}>
                    <ToolTipButton
                        Icon={Icon}
                        onClick={() => handleToolChange(title)}
                        title={title}
                    />
                </div>
            ))}
            {isPanelOpen && <ColorPanel />}
        </div>
    );
}
