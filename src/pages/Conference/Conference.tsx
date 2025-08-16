import { ConferenceProvider } from '@/context/ConferenceContext';
import ConferenceRoom from '@/components/Conference/ConferenceRoom/ConferenceRoom';
// import styles from "./styles.module.css";

export default function Conference() {

    return (
        <ConferenceProvider>
            <ConferenceRoom />
        </ConferenceProvider>
    );
}