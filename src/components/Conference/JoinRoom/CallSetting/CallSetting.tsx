import { useState } from 'react';
import { useMediaStream } from '@/hooks/useMediaStream';
import Button from '@/components/common/Button/Button';
import SelectBox, { type TMenuItem } from '@/components/common/SelectBox/SelectBox';
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
                <SelectBox label="Video" menu={videos}
                    selected={selectedVideo}
                    onClick={handleItemClick} />

                <SelectBox label="Microphone" menu={microphones}
                    selected={selectedMicrophone}
                    onClick={handleItemClick} />

                <SelectBox label="Speakers" menu={videos}
                    selected={selectedVideo}
                    onClick={handleItemClick} />
            </ul>

            <Button text='Save Settings' onClick={onClose} />
        </div>
    );
}