import { useState } from "react";
import { getActions } from '@/stores';
import TextInput from "@/components/common/TextInput/TextInput";
<<<<<<< HEAD:src/components/Messenger/AddGroup/AddGroupForm/AddGroupForm.tsx
import Button from "@/components/common/Button/Button";
=======
import EmojiIcon from "@/components/common/icons/EmojiIcon";
import Button from "@/components/common/Button/Button";
import Emoji from "@/components/common/Emoji/Emoji";
>>>>>>> messenger:src/components/Messenger/AddGroupForm/AddGroupForm.tsx
import styles from "./styles.module.css";


export default function AddGroupForm() {
  const { setOpenAlert, setAlertMessage } = getActions();

  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });

  const handleReset = () => {
    setInputs({
      name: "",
      description: "",
    });
    setSelectedEmoji(null);
  };

  const handleSave = () => {
    if (!inputs.name || !inputs.description || !selectedEmoji) {
      setAlertMessage("모든 필드를 채워주세요.");
      setOpenAlert(true);
      return;
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.add_group_form_container}>
      <h2 className={styles.title}>그룹 생성</h2>
      <i
        className={styles.emoji_icon}
        onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
      >
        {selectedEmoji ? selectedEmoji : <EmojiIcon />}
        {emojiPickerOpen && (
          <div className={styles.emoji_picker_container}>
            <Emoji setSelectedEmoji={setSelectedEmoji} />
          </div>
        )}
      </i>
      <TextInput
        name="name"
        placeholder="그룹명을 입력해주세요."
        value={inputs.name}
        onChange={handleChange}
      />
      <TextInput
        name="description"
        placeholder="그룹에 대해 간단히 설명해주세요."
        value={inputs.description}
        onChange={handleChange}
      />

      <div className={styles.button_wrap}>
<<<<<<< HEAD:src/components/Messenger/AddGroup/AddGroupForm/AddGroupForm.tsx
        <Button type="etc" text="Reset" onClick={() => {}} />
        <Button text="Save" onClick={() => {}} />
=======
        <Button type="etc" text="Reset" onClick={handleReset} />
        <Button text="Save" onClick={handleSave} />
>>>>>>> messenger:src/components/Messenger/AddGroupForm/AddGroupForm.tsx
      </div>
    </div>
  );
}
