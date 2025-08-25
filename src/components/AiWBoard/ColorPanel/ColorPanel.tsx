import { getActions, useCanvas, useColor, useStroke } from '@/stores';
import { COLORS, STROKE_ICONS, STROKES } from '@/utils/color-panel';
import styles from "./styles.module.css";

export default function ColorPanel() {
    const canvas = useCanvas();
    const activeColor = useColor();
    const activeStroke = useStroke();
    const { setActiveColor, setActiveStroke } = getActions();

    const handleStrokeClick = (width: number) => {
        setActiveStroke(width);

        if (canvas?.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = width;
        }
    }

    const handleColorClick = (color: string) => {
        setActiveColor(color);

        if (canvas?.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = color;
        }
    }

    return <ul className={styles.penOptions}>
        <li className={styles.stroke}>
            {STROKES.map((width) => (
                <button
                    key={width}
                    type="button"
                    onClick={() => handleStrokeClick(width)}
                    className={activeStroke === width ? styles.active : ""}
                >
                    <img src={STROKE_ICONS[width]} alt={`stroke-${width}`} />
                </button>
            ))}
        </li>
        <li className={styles.color}>
            {COLORS.map((color, index) => (
                <div
                    key={index}
                    onClick={() => handleColorClick(color)}
                    className={`${styles.colorChip} ${activeColor === color ? styles.active : ""
                        }`}
                >
                    <div
                        className={styles.colorCircle}
                        style={{
                            background: color,
                            border: color === "#FFF" ? "1px solid #646464" : undefined,
                        }}
                    ></div>
                </div>
            ))}
        </li>
    </ul>;
}