
import { useEffect, useRef } from 'react';
import * as fabric from "fabric";
import { getActions, useStroke } from '@/stores';
import ControllerButton from '@/components/AiWBoard/ControllerButton/ControllerButton';
import styles from "./styles.module.css";


export default function Canvas() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCanvas } = getActions();
    const activeStroke = useStroke();

    useEffect(() => {
        if (!canvasContainerRef.current || !canvasRef.current) return;

        const canvasContainer = canvasContainerRef.current;
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasContainer.offsetWidth,
            height: canvasContainer.offsetHeight
        });

        setCanvas(newCanvas);
        if (!(newCanvas instanceof fabric.Canvas)) return;
        const brush = new fabric.PencilBrush(newCanvas);

        newCanvas.backgroundColor = "white";

        // 휠을 이용해서 줌인/줌아웃
        newCanvas.on("mouse:wheel", (opt) => {
            const delta = opt.e.deltaY;
            let zoom = newCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            newCanvas.zoomToPoint(new fabric.Point(opt.e.offsetX, opt.e.offsetY), zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
        });

        // 윈도우 리사이즈 이벤트 감지
        const handleResize = () => {
            newCanvas.setDimensions({
                width: canvasContainer.offsetWidth,
                height: canvasContainer.offsetHeight
            });
        };
        window.addEventListener("resize", handleResize);

        newCanvas.isDrawingMode = true;
        newCanvas.freeDrawingBrush = brush;
        newCanvas.freeDrawingBrush.width = activeStroke;

        // 언마운트 시 캔버스 정리, 이벤트 제거
        return () => {
            newCanvas.dispose();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className={styles.ai_w_board} ref={canvasContainerRef}>
            <canvas ref={canvasRef} />
            <ControllerButton />
        </div>
    );
}