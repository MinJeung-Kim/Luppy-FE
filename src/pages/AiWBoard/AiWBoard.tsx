import { useEffect, useRef, useState } from 'react';
import * as fabric from "fabric";
import { getActions, useCanvas } from '@/stores';
import ControllerButton from '@/components/AiWBoard/ControllerButton/ControllerButton';
import styles from "./styles.module.css";

export default function AiWBoard() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedTool, setSelectedTool] = useState<string>("그리기");

    const canvas = useCanvas()
    const { setCanvas } = getActions();

    const initializeCanvas = () => {
        if (!canvasContainerRef.current || !canvasRef.current) return;

        const canvasContainer = canvasContainerRef.current;
        // 캔버스 생성
        const newCanvas = new fabric.Canvas(canvasRef.current, {
            width: canvasContainer.offsetWidth,
            height: canvasContainer.offsetHeight,
        });

        setCanvas(newCanvas);

        // newCanvas.backgroundColor = "white";

        // 언마운트 시 캔버스 정리, 이벤트 제거
        return () => {
            newCanvas.dispose();
        };
    };

    useEffect(() => {
        const cleanup = initializeCanvas();
        return cleanup;
    }, []);

    useEffect(() => {
        if (!canvas) return;

        const handleResize = () => {
            const scaleX = canvasContainerRef.current!.offsetWidth / canvas.width!;
            const scaleY = canvasContainerRef.current!.offsetHeight / canvas.height!;

            canvas.setDimensions({
                width: canvasContainerRef.current!.offsetWidth,
                height: canvasContainerRef.current!.offsetHeight,
            });

            canvas.getObjects().forEach((obj) => {
                obj.scaleX = obj.scaleX! * scaleX;
                obj.scaleY = obj.scaleY! * scaleY;
                obj.left = obj.left! * scaleX;
                obj.top = obj.top! * scaleY;
                obj.setCoords();
            });

            canvas.renderAll();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [canvas]);

    return <div className={styles.ai_w_board} ref={canvasContainerRef}>
        <canvas ref={canvasRef} />
        <ControllerButton selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
    </div>;
}