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

    chatContent: TChatContent[] | null;
    setChatContent: React.Dispatch<React.SetStateAction<TChatContent[] | null>>;

    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    setTotalPages: (total: number) => void;
};

const MessengerContext = createContext<State>({} as State);

export function MessengerProvider({ children }: { children: React.ReactNode }) {
    const [isModal, setIsModal] = useState(false);
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [chatRoomId, setChatRoomId] = useState<number | null>(null);
    const [chatContent, setChatContent] = useState<TChatContent[] | null>(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

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
                currentPage,
                setCurrentPage,
                totalPages,
                setTotalPages,
            }}
        >
            {children}
        </MessengerContext.Provider>
    );
}

export const useMessenger = () => useContext(MessengerContext);
