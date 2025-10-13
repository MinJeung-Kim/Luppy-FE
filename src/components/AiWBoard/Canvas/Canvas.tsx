
import { useEffect, useRef, useState } from 'react';
import * as fabric from "fabric";
import { analyzeShape } from '@/api/canvas';
import type { TUnsplashImage } from '@/stores/slice/canvas';
import { getActions, useRecommendations, useStroke } from '@/stores';
import ControllerButton from '@/components/AiWBoard/ControllerButton/ControllerButton';
import styles from "./styles.module.css";

type PathCreatedPayload = fabric.CanvasEvents["path:created"]; // payload 타입 추출

export default function Canvas() {
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { setCanvas, setRecommendations } = getActions();
    const activeStroke = useStroke();
    const recommendations = useRecommendations();
    const [currentPage, setCurrentPage] = useState(0);
    const imagesPerPage = 5;

    // 전체 이미지를 페이지별로 나누기
    const allImages = recommendations.flat();
    const totalPages = Math.ceil(allImages.length / imagesPerPage);

    // 슬라이드 애니메이션을 위한 transform 계산
    const getTransformValue = () => {
        if (allImages.length === 0) return 'translateX(0)';
        const imageWidth = 120; // 이미지 + 패딩 + 간격
        const translateX = -currentPage * imageWidth * imagesPerPage;
        return `translateX(${translateX}px)`;
    };

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

        // newCanvas.backgroundColor = "#eee;";

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

        const handlePathCreated = async (opt: PathCreatedPayload) => {
            const path = opt.path;
            console.log("Path 생성됨:", path?.type, path);
            if (!path) return;

            const br = path.getBoundingRect();
            const dataUrl = newCanvas.toDataURL({
                format: "png",
                left: br.left,
                top: br.top,
                width: br.width,
                height: br.height,
                multiplier: 1,         // 0.5~1 정도로 조절해 용량 축소 가능
                enableRetinaScaling: false,
            });
            const blob = await (await fetch(dataUrl)).blob();

            const fd = new FormData();
            fd.append("file", blob, "crop.png");
            fd.append("hint", JSON.stringify({
                stroke: (path.stroke as string),
                bbox: br,
            }));


            const res = await analyzeShape(fd);

            console.log("추천 주제:", res);
            setRecommendations(res);
        };
        newCanvas.on("path:created", handlePathCreated);

        return () => {
            newCanvas.off("path:created", handlePathCreated);
            newCanvas.dispose();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // 드래그/스와이프 기능을 위한 상태와 핸들러
    const [startX, setStartX] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePrevPage = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentPage(prev => Math.max(0, prev - 1));
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleNextPage = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isAnimating) return;
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!startX || !isDragging || isAnimating) return;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) { // 최소 50px 이동해야 스와이프로 인식
            if (diff > 0 && currentPage < totalPages - 1) {
                handleNextPage();
            } else if (diff < 0 && currentPage > 0) {
                handlePrevPage();
            }
        }

        setStartX(null);
        setIsDragging(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isAnimating) return;
        setStartX(e.clientX);
        setIsDragging(true);
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!startX || !isDragging || isAnimating) return;

        const endX = e.clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentPage < totalPages - 1) {
                handleNextPage();
            } else if (diff < 0 && currentPage > 0) {
                handlePrevPage();
            }
        }

        setStartX(null);
        setIsDragging(false);
    };

    return (
        <div className={styles.ai_w_board} ref={canvasContainerRef}>
            <canvas ref={canvasRef} />
            {allImages.length > 0 && (
                <div className={styles.recommendationsContainer}>
                    <div
                        className={styles.recommendationsSlider}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        {currentPage > 0 && (
                            <button
                                className={`${styles.navButton} ${styles.prevButton}`}
                                onClick={handlePrevPage}
                                aria-label="이전 이미지"
                            >
                                ‹
                            </button>
                        )}

                        <div className={styles.recommendationsWrapper}>
                            <ul
                                className={styles.recommendations}
                                style={{ transform: getTransformValue() }}
                            >
                                {allImages.map(({ id, urls, alt }: TUnsplashImage) =>
                                    <li key={id}>
                                        <img src={urls.small} alt={alt} />
                                    </li>
                                )}
                            </ul>
                        </div>

                        {currentPage < totalPages - 1 && (
                            <button
                                className={`${styles.navButton} ${styles.nextButton}`}
                                onClick={handleNextPage}
                                aria-label="다음 이미지"
                            >
                                ›
                            </button>
                        )}
                    </div>


                </div>
            )}
            <ControllerButton />
        </div>
    );
}