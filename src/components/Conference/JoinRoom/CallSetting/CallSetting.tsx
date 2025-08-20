import { useState } from 'react';
import { useMediaStream } from '@/hooks/useMediaStream';
import Button from '@/components/common/Button/Button';
import CallSelectBox, { type TMenuItem } from '@/components/Conference/JoinRoom/CallSelectBox/CallSelectBox';
import styles from "./styles.module.css";

type Props = {
    onClose: () => void;
};

export default function CallSetting({ onClose }: Props) {
    const { videos, microphones, getMediaStream } = useMediaStream();
    const [selectedVideo, setSelectedVideo] = useState<TMenuItem>({ deviceId: '', label: '' });
    const [selectedMicrophone, setSelectedMicrophone] = useState<TMenuItem>({ deviceId: '', label: '' });

    const handleItemClick = async (label: string, item: { deviceId: string; label: string }) => {
        if (label === "Video") {
            setSelectedVideo(item);
            await getMediaStream(item.deviceId);
        } else if (label === "Microphone") {
            setSelectedMicrophone(item);
            await getMediaStream(item.deviceId);
        }
    };

    return (
        <div className={styles.call_settings_container}>
            <ul className={styles.call_settings}>
                <CallSelectBox label="Video" menu={videos}
                    selected={selectedVideo}
                    onClick={handleItemClick} />

                <CallSelectBox label="Microphone" menu={microphones}
                    selected={selectedMicrophone}
                    onClick={handleItemClick} />

                <CallSelectBox label="Speakers" menu={videos}
                    selected={selectedVideo}
                    onClick={handleItemClick} />
            </ul>

            <Button text='Save Settings' onClick={onClose} />
        </div>
    );
}