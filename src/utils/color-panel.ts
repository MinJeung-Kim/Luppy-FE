
import strokeLightIcon from '@/assets/icons/strokeLightIcon.svg';
import strokeMediumIcon from '@/assets/icons/strokeMediumIcon.svg';
import strokeBoldIcon from '@/assets/icons/strokeBoldIcon.svg';

interface StrokeIconMap {
    [key: number]: string;
}

export const COLORS = [
    "#000000",
    "#FFFFFF",
    "#CF3F41",
    "#2D66CB",
    "#E6B649",
    "#479734",
];
export const STROKES = [5, 10, 15];

export const STROKE_ICONS: StrokeIconMap = {
    5: strokeLightIcon,
    10: strokeMediumIcon,
    15: strokeBoldIcon,
};