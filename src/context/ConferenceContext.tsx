import {
    createContext,
    useContext,
    useState,
} from "react";

type State = {
    selectedUsers: number[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;

    isCreatedRoom: boolean;
    setIsCreatedRoom: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConferenceContext = createContext<State>({} as State);

export function ConferenceProvider({ children }: { children: React.ReactNode }) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [isCreatedRoom, setIsCreatedRoom] = useState<boolean>(false);

    return (
        <ConferenceContext.Provider
            value={{
                selectedUsers,
                setSelectedUsers,
                isCreatedRoom,
                setIsCreatedRoom,
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
}

export const useConference = () => useContext(ConferenceContext);
