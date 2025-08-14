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

    isCallSetting: boolean;
    setIsCallSetting: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConferenceContext = createContext<State>({} as State);

export function ConferenceProvider({ children }: { children: React.ReactNode }) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [isCreatedRoom, setIsCreatedRoom] = useState<boolean>(false);
    const [joinUsers, setJoinUsers] = useState<TJoinUser[]>([]);
    const [isCallSetting, setIsCallSetting] = useState<boolean>(false);


    return (
        <ConferenceContext.Provider
            value={{
                selectedUsers,
                setSelectedUsers,
                isCreatedRoom,
                setIsCreatedRoom, joinUsers, setJoinUsers, isCallSetting, setIsCallSetting
            }}
        >
            {children}
        </ConferenceContext.Provider>
    );
}

export const useConference = () => useContext(ConferenceContext);
