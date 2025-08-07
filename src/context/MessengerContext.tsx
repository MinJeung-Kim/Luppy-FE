import {
    createContext,
    useContext,
    useState,
} from "react";
import type { TChatContent } from '@/api/chat';

type State = {
    isModal: boolean;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;

    isSelectedChat: boolean;
    setIsSelectedChat: React.Dispatch<React.SetStateAction<boolean>>;

    chatRoomId: number | null;
    setChatRoomId: React.Dispatch<React.SetStateAction<number | null>>;

    chatContent: TChatContent[];
    setChatContent: React.Dispatch<React.SetStateAction<TChatContent[]>>;
};

const MessengerContext = createContext<State>({} as State);

export function MessengerProvider({ children }: { children: React.ReactNode }) {
    const [isModal, setIsModal] = useState(false);
    const [isSelectedChat, setIsSelectedChat] = useState(false);
    const [chatRoomId, setChatRoomId] = useState<number | null>(null);
    const [chatContent, setChatContent] = useState<TChatContent[]>([]);

    return (
        <MessengerContext.Provider
            value={{
                isModal,
                setIsModal,
                isSelectedChat,
                setIsSelectedChat,
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
