import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getActions } from '@/stores';
import { createGroup } from '@/api/chat';
import TextInput from "@/components/common/TextInput/TextInput";
import Button from "@/components/common/Button/Button";
import EmojiIcon from "@/components/common/icons/EmojiIcon";
import Emoji from "@/components/common/Emoji/Emoji";
import styles from "./styles.module.css";


export default function AddGroupForm() {
  const { setOpenAlert, setAlertMessage } = getActions();
  const queryClient = useQueryClient();

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

  const { mutate: mutateCreateGroup, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedEmoji) throw new Error('이모지가 없습니다.');
      return await createGroup(inputs.name, inputs.description, selectedEmoji);
    },
    onSuccess: () => {
      setAlertMessage('그룹이 생성되었습니다.');
      setOpenAlert(true);
      // 목록 재조회
      queryClient.invalidateQueries({ queryKey: ['groupList'] });
      handleReset();
    },
    onError: () => {
      setAlertMessage('그룹 생성에 실패했습니다.');
      setOpenAlert(true);
    }
  });

  const handleSave = () => {
    if (!inputs.name || !selectedEmoji) {
      setAlertMessage("모든 필드를 채워주세요.");
      setOpenAlert(true);
      return;
    }
    mutateCreateGroup();
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
          <div className={styles.emoji_picker_container} onClick={(e) => e.stopPropagation()}>
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

        <Button type="etc" text="Reset" onClick={handleReset} />
        <Button text={isPending ? 'Saving...' : 'Save'} onClick={handleSave} disabled={isPending} />
      </div >
    </div >
  );
}
