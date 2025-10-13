import * as fabric from "fabric";

export type Pt = { x: number; y: number };

/** SVG Path 명령 튜플 타입 정의 (대소문자 모두 대응) */
type M = ['M' | 'm', number, number];
type L = ['L' | 'l', number, number];
type Q = ['Q' | 'q', number, number, number, number];               // cx, cy, x, y
type C = ['C' | 'c', number, number, number, number, number, number]; // x1,y1,x2,y2,x,y
type Z = ['Z' | 'z'];

export type PathCommand = M | L | Q | C | Z;

/** Fabric Path → 점 시퀀스 추출 (end-point 기준) */
export function getPointsFromFabricPath(path: fabric.Path): Pt[] {
    const raw = path.path as PathCommand[]; // fabric에서 제공하는 path 명령 배열
    const pts: Pt[] = [];
    let currentPos: Pt = { x: 0, y: 0 }; // 상대 좌표 처리를 위한 현재 위치 추적

    for (const cmd of raw) {
        const t = cmd[0];

        switch (t) {
            case 'M': {
                const [, x, y] = cmd;
                currentPos = { x, y };
                pts.push({ x, y });
                break;
            }
            case 'm': {
                const [, dx, dy] = cmd;
                currentPos = { x: currentPos.x + dx, y: currentPos.y + dy };
                pts.push({ ...currentPos });
                break;
            }
            case 'L': {
                const [, x, y] = cmd;
                currentPos = { x, y };
                pts.push({ x, y });
                break;
            }
            case 'l': {
                const [, dx, dy] = cmd;
                currentPos = { x: currentPos.x + dx, y: currentPos.y + dy };
                pts.push({ ...currentPos });
                break;
            }
            case 'Q': {
                const [, , , x, y] = cmd;
                currentPos = { x, y };
                pts.push({ x, y });
                break;
            }
            case 'q': {
                const [, , , dx, dy] = cmd;
                currentPos = { x: currentPos.x + dx, y: currentPos.y + dy };
                pts.push({ ...currentPos });
                break;
            }
            case 'C': {
                const [, , , , , x, y] = cmd;
                currentPos = { x, y };
                pts.push({ x, y });
                break;
            }
            case 'c': {
                const [, , , , , dx, dy] = cmd;
                currentPos = { x: currentPos.x + dx, y: currentPos.y + dy };
                pts.push({ ...currentPos });
                break;
            }
            case 'Z': case 'z': {
                // close — 첫 번째 점으로 돌아감
                if (pts.length > 0) {
                    currentPos = pts[0];
                }
                break;
            }
            default:
                // 타입적으로 여기 오지 않지만, 미래 확장 대비
                // const _never: never = t;
                break;
        }
    }

    return pts;
}

/* -------------------- 아래는 너가 준 도형 판별 로직(타입만 정리) -------------------- */

function rdp(points: Pt[], epsilon = 4): Pt[] {
    if (points.length < 3) return points;
    const dPerp = (p: Pt, a: Pt, b: Pt) => {
        const A = { x: b.x - a.x, y: b.y - a.y };
        const num = Math.abs(A.x * (a.y - p.y) - (a.x - p.x) * A.y);
        const den = Math.hypot(A.x, A.y) || 1;
        return num / den;
    };
    const recurse = (pts: Pt[], start: number, end: number, eps: number, out: Pt[]) => {
        let idx = -1, max = 0;
        for (let i = start + 1; i < end; i++) {
            const d = dPerp(pts[i], pts[start], pts[end]);
            if (d > max) { max = d; idx = i; }
        }
        if (max > eps) {
            recurse(pts, start, idx, eps, out);
            recurse(pts, idx, end, eps, out);
        } else {
            out.push(pts[start]);
        }
    };
    const out: Pt[] = [];
    recurse(points, 0, points.length - 1, epsilon, out);
    out.push(points[points.length - 1]);
    return out;
}

// function isClosed(points: Pt[], thresh = 15) {
//     if (points.length < 3) return false;
//     const last = points[points.length - 1];
//     const first = points[0];
//     const dx = first.x - last.x;
//     const dy = first.y - last.y;
//     return dx * dx + dy * dy <= thresh * thresh;
// }

function angle(p: Pt, q: Pt, r: Pt) {
    const v1 = { x: p.x - q.x, y: p.y - q.y };
    const v2 = { x: r.x - q.x, y: r.y - q.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const n1 = Math.hypot(v1.x, v1.y) || 1;
    const n2 = Math.hypot(v2.x, v2.y) || 1;
    const cos = Math.max(-1, Math.min(1, dot / (n1 * n2)));
    return Math.acos(cos) * 180 / Math.PI;
}

function distance(p1: Pt, p2: Pt): number {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

function getCentroid(points: Pt[]): Pt {
    const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    return { x: sum.x / points.length, y: sum.y / points.length };
}

function isCircle(points: Pt[]): { isCircle: boolean; center?: Pt; radius?: number } {
    if (points.length < 5) return { isCircle: false }; // 최소 점 개수를 8에서 5로 줄임

    const center = getCentroid(points);
    const distances = points.map(p => distance(p, center));
    const avgRadius = distances.reduce((s, d) => s + d, 0) / distances.length;
    const radiusVariance = distances.reduce((s, d) => s + Math.pow(d - avgRadius, 2), 0) / distances.length;
    const radiusStdDev = Math.sqrt(radiusVariance);

    // 표준편차가 평균 반지름의 25% 이하이면 원으로 판정 (15%에서 25%로 완화)
    const threshold = avgRadius * 0.35;
    if (radiusStdDev <= threshold) {
        return { isCircle: true, center, radius: avgRadius };
    }
    return { isCircle: false };
}

function isTriangle(points: Pt[]): { isTriangle: boolean; vertices?: Pt[] } {
    const simp = rdp(points, 4);

    // 시작/끝 중복 제거
    let poly = simp;
    if (poly.length > 1) {
        const last = poly[poly.length - 1];
        const first = poly[0];
        if (Math.hypot(last.x - first.x, last.y - first.y) < 1) {
            poly = poly.slice(0, -1);
        }
    }

    if (poly.length !== 3) return { isTriangle: false };

    const [A, B, C] = poly;

    // 삼각형의 세 변의 길이 계산
    const AB = distance(A, B);
    const BC = distance(B, C);
    const CA = distance(C, A);

    // 삼각형 부등식 확인 (한 변이 다른 두 변의 합보다 작아야 함)
    if (AB + BC <= CA || BC + CA <= AB || CA + AB <= BC) {
        return { isTriangle: false };
    }

    // 세 변의 길이가 모두 합리적인 범위에 있는지 확인 (너무 찌그러지지 않음)
    const minSide = Math.min(AB, BC, CA);
    const maxSide = Math.max(AB, BC, CA);

    // 가장 긴 변이 가장 짧은 변의 5배를 넘지 않아야 함
    if (maxSide / minSide > 5) {
        return { isTriangle: false };
    }

    return { isTriangle: true, vertices: [A, B, C] };
}

export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'other';

export interface ShapeResult {
    shape: ShapeType;
    corners?: Pt[];
    center?: Pt;
    radius?: number;
    vertices?: Pt[];
}

/** 도형 타입을 한국어 레이블로 변환 */
export function getShapeLabel(shapeType: ShapeType): string {
    switch (shapeType) {
        case 'rectangle':
            return '사각형';
        case 'circle':
            return '원형';
        case 'triangle':
            return '삼각형';
        case 'other':
        default:
            return '사용자 자유곡선';
    }
}

function getBBox(points: Pt[]) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function isClosed(points: Pt[], threshPx?: number) {
    if (points.length < 3) return false;
    const first = points[0];
    const last = points[points.length - 1];
    const { w, h } = getBBox(points);
    const diag = Math.hypot(w, h);
    // 도형이 클수록 허용 오차도 넉넉히 (최소 10px, 대각선의 12%)
    const thresh = threshPx ?? Math.max(10, diag * 0.12);
    return distance(first, last) <= thresh;
}


export function classifyShape(points: Pt[]): ShapeResult {
    // 닫힘이 아니더라도 거의 닫히면 강제로 닫아서 판정해보자
    let pts = points.slice();
    if (!isClosed(pts)) {
        const { w, h } = getBBox(pts);
        const diag = Math.hypot(w, h);
        const nearCloseThresh = Math.max(14, diag * 0.2); // 20% 까지는 “거의 닫힘”으로 봄
        if (distance(pts[0], pts[pts.length - 1]) <= nearCloseThresh) {
            pts = pts.concat(pts[0]); // 첫 점을 끝에 붙여 닫힘 처리
        } else {
            return { shape: 'other' };
        }
    }

    // ↓↓↓ 기존 로직에서 points 대신 pts 사용
    const circleResult = isCircle(pts);
    if (circleResult.isCircle) {
        return { shape: 'circle', center: circleResult.center, radius: circleResult.radius };
    }

    const triangleResult = isTriangle(pts);
    if (triangleResult.isTriangle) {
        return { shape: 'triangle', vertices: triangleResult.vertices };
    }

    // 사각형 판정도 pts 사용 + RDP epsilon을 크기 비례로
    const { w, h } = getBBox(pts);
    const diag = Math.hypot(w, h);
    const simp = rdp(pts, Math.max(4, diag * 0.02));

    // 시작/끝 중복 제거
    let poly = simp;
    if (poly.length > 1) {
        const last = poly[poly.length - 1];
        const first = poly[0];
        if (distance(last, first) < Math.max(1, diag * 0.005)) poly = poly.slice(0, -1);
    }
    if (poly.length !== 4) return { shape: 'other' };

    const [A, B, C, D] = poly;
    const angs = [angle(D, A, B), angle(A, B, C), angle(B, C, D), angle(C, D, A)];
    if (angs.some(a => Math.abs(a - 90) > 15)) return { shape: 'other' };

    const len = (p: Pt, q: Pt) => Math.hypot(p.x - q.x, p.y - q.y);
    const AB = len(A, B), BC = len(B, C), CD = len(C, D), DA = len(D, A);
    const ratio = (x: number, y: number) => Math.max(x, y) / Math.max(1, Math.min(x, y));
    if (ratio(AB, CD) > 1.25 || ratio(BC, DA) > 1.25) return { shape: 'other' };

    return { shape: 'rectangle', corners: [A, B, C, D] };
}

