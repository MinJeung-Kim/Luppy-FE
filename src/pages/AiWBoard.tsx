import { Helmet } from "react-helmet-async";
import { AI_W_BOARD_PAGE_META } from '@/constants/page_messages';
import Canvas from '@/components/AiWBoard/Canvas/Canvas';

export default function AiWBoard() {
    return (
        <>
            <Helmet>
                <title>{AI_W_BOARD_PAGE_META.title}</title>
                <meta name="desc" content={AI_W_BOARD_PAGE_META.desc} />
                <meta property="og:title" content={AI_W_BOARD_PAGE_META.ogTitle} />
                <meta property="og:type" content="website" />
            </Helmet>
            <Canvas />
        </>
    );
}