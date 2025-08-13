import {
    createContext,
    useContext,
    useState,
} from "react";

export type TJoinUser = {
    id: number;
    name: string;
    profile: string;
    isMicOn: boolean;
    isVideoOn: boolean;
}

type State = {
    selectedUsers: number[];
    setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;

    isCreatedRoom: boolean;
    setIsCreatedRoom: React.Dispatch<React.SetStateAction<boolean>>;

    joinUsers: TJoinUser[];
    setJoinUsers: React.Dispatch<React.SetStateAction<TJoinUser[]>>;
};

const ConferenceContext = createContext<State>({} as State);

export function ConferenceProvider({ children }: { children: React.ReactNode }) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [isCreatedRoom, setIsCreatedRoom] = useState<boolean>(false);
    const [joinUsers, setJoinUsers] = useState<TJoinUser[]>([]);


    return (
        <ConferenceContext.Provider
            value={{
                selectedUsers,
                setSelectedUsers,
                isCreatedRoom,
                setIsCreatedRoom, joinUsers, setJoinUsers
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
}

export const useConference = () => useContext(ConferenceContext);
