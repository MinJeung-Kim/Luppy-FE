import * as fabric from "fabric";
import { useCanvas, useColor } from '@/stores';
import ColorIcon from '@/components/common/icons/ColorIcon';
import ColorTextIcon from '@/components/common/icons/ColorTextIcon';
import ToolTipButton from '@/components/common/ToolTipButton/ToolTipButton';
import PencilIcon from '@/components/common/icons/PencilIcon';
import EraserIcon from '@/components/common/icons/EraserIcon';
import CursorIcon from '@/components/common/icons/CursorIcon';
import DeleteIcon from '@/components/common/icons/DeleteIcon';
import styles from "./styles.module.css";

type Props = {
    setSelectedTool: (tool: string) => void;
}

export default function ControllerButton({ setSelectedTool }: Props) {
    const canvas = useCanvas();
    const color = useColor();

    const switchButton = (tool: string) => {
        if (!(canvas instanceof fabric.Canvas)) return;

        switch (tool) {
            case "그리기": {
                console.log("그리기");

                const brush = new fabric.PencilBrush(canvas);
                canvas.freeDrawingBrush = brush;
                canvas.freeDrawingBrush.color = color;
                // canvas.freeDrawingBrush.width = stroke;

                canvas.isDrawingMode = true;
                canvas.defaultCursor = "default";
                // canvas.defaultCursor = `url(${PenCursor}) 0 32, auto`;
                return;
            }
            case "지우기": {
                canvas.selection = true;

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
                return;
            }
            case "수정": {
                canvas.selection = true;
                return;
            }
            case "텍스트": {
                const text = new fabric.IText("텍스트를 입력하세요", {
                    left: 100,
                    top: 100,
                    fontFamily: "arial",
                    fill: color,
                    fontSize: 20,
                });
                canvas.add(text);
                canvas.setActiveObject(text);
                return;
            }
            case "색상":
                return;
            case "전체 삭제": {
                canvas.clear();
                return;
            }
            default:
                break;
        }
    }

    const handleToolChange = (tool: string) => {
        setSelectedTool(tool);
        switchButton(tool)
    };

    const TOOLS = [
        { Icon: <PencilIcon />, title: "그리기" },
        { Icon: <EraserIcon />, title: "지우기" },
        { Icon: <CursorIcon />, title: "수정" },
        { Icon: <ColorTextIcon />, title: "텍스트" },
        { Icon: <ColorIcon />, title: "색상" },
        { Icon: <DeleteIcon />, title: "전체 삭제" },
    ]

    return <div className={styles.controller_button}>
        {TOOLS.map(({ Icon, title }) => (
            <ToolTipButton
                key={title}
                Icon={Icon}
                onClick={() => handleToolChange(title)}
                title={title}
            />
        ))}
    </div>;
}
