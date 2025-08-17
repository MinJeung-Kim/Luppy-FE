
import data, { type Emoji } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import styles from "./styles.module.css";

interface EmojiSelectPayload {
  native: string;
}

type Props = {
  setSelectedEmoji: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Emoji({ setSelectedEmoji }: Props) {

  const handleEmojiClick = (emojiData: EmojiSelectPayload) => {
    const native = emojiData.native;
    setSelectedEmoji(native);
  };

  return (
    <div className={styles.emoji_container}>
      <Picker data={data}
        onEmojiSelect={handleEmojiClick}
      />
    </div>
  );
}
