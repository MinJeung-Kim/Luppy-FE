import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import styles from "./styles.module.css";

type Props = {
  setSelectedEmoji: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Emoji({ setSelectedEmoji }: Props) {
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setSelectedEmoji(emojiData.emoji);
  };

  return (
    <div className={styles.emoji_container}>
      <EmojiPicker
        width="100%"
        height="300px"
        previewConfig={{
          showPreview: false,
        }}
        onEmojiClick={handleEmojiClick}
      />
    </div>
  );
}
