import {
    createContext,
    useContext,
    useState,
} from "react";
import type { TChatContent } from '@/api/chat';

type State = {
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;

    selectedChat: number | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<number | null>>;

    chatRoomId: number | null;
    setChatRoomId: React.Dispatch<React.SetStateAction<number | null>>;

    chatContent: TChatContent[];
    setChatContent: React.Dispatch<React.SetStateAction<TChatContent[]>>;

};

const MessengerContext = createContext<State>({} as State);

export function MessengerProvider({ children }: { children: React.ReactNode }) {
    const [isModal, setIsModal] = useState(false);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [chatRoomId, setChatRoomId] = useState<number | null>(null);
    const [chatContent, setChatContent] = useState<TChatContent[]>([]);

    return (
        <MessengerContext.Provider
            value={{
                isModal,
                setIsModal,
                selectedChat,
                setSelectedChat,
                chatRoomId,
                setChatRoomId,
                chatContent,
                setChatContent,
            }}
        >
            {children}
        </MessengerContext.Provider>
    );
}

export const useMessenger = () => useContext(MessengerContext);
