import { Helmet } from "react-helmet-async";
import { ConferenceProvider } from '@/context/ConferenceContext';
import ConferenceRoom from '@/components/Conference/ConferenceRoom/ConferenceRoom';
import { CONFERENCE_PAGE_META } from '@/constants/page_messages';
// import styles from "./styles.module.css";

export default function Conference() {

    return (
        <ConferenceProvider>
            <Helmet>
                <title>{CONFERENCE_PAGE_META.title}</title>
                <meta name="desc" content={CONFERENCE_PAGE_META.desc} />
                <meta property="og:title" content={CONFERENCE_PAGE_META.ogTitle} />
                <meta property="og:type" content="website" />
            </Helmet>
            <ConferenceRoom />
        </ConferenceProvider>
    );
}