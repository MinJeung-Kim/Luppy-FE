import * as fabric from "fabric";
import { useBoundStore, type BoundState } from "./bound-store";

const guestsSelector = (state: BoundState) => state.guests;
const userSelector = (state: BoundState) => state.user;
const chatSelector = (state: BoundState) => state.roomId;
const socketSelector = (state: BoundState) => state.socket;
const accessTokenSelector = (state: BoundState) => state.accessToken;
const openAlertSelector = (state: BoundState) => state.openAlert;
const alertMessageSelector = (state: BoundState) => state.alertMessage;
const selectedMenuSelector = (state: BoundState) => state.selectedMenu;
const isGlobalModalSelector = (state: BoundState) => state.isGlobalModal;
const conferenceIdSelector = (state: BoundState) => state.conferenceId;
const isCreatedRoomSelector = (state: BoundState) => state.isCreatedRoom;
const joinUserSelector = (state: BoundState) => state.joinUser;
const chatGroupListSelector = (state: BoundState) => state.chatGroupList;
const selectedGroupIdSelector = (state: BoundState) => state.selectedGroupId;

const canvasSelector = (state: BoundState) => state.canvas;
const colorSelector = (state: BoundState) => state.color;

export const useGuests = () => useBoundStore(guestsSelector);
export const useUser = () => useBoundStore(userSelector);
export const useChat = () => useBoundStore(chatSelector);
export const useSocket = () => useBoundStore(socketSelector);
export const useAccessToken = () => useBoundStore(accessTokenSelector);
export const useOpenAlert = () => useBoundStore(openAlertSelector);
export const useAlertMessage = () => useBoundStore(alertMessageSelector);
export const useSelectedMenu = () => useBoundStore(selectedMenuSelector);
export const useIsGlobalModal = () => useBoundStore(isGlobalModalSelector);
export const useConferenceId = () => useBoundStore(conferenceIdSelector);
export const useIsCreatedRoom = () => useBoundStore(isCreatedRoomSelector);
export const useJoinUser = () => useBoundStore(joinUserSelector);
export const useChatGroupList = () => useBoundStore(chatGroupListSelector);
export const useSelectedGroupId = () => useBoundStore(selectedGroupIdSelector);

export const useCanvas = () => useBoundStore(canvasSelector);
export const useColor = () => useBoundStore(colorSelector);

// 상태 변경 시 컴포넌트가 리렌더링되지 않음
export const getGuests = () => guestsSelector(useBoundStore.getState());
export const getUser = () => userSelector(useBoundStore.getState());
export const getChat = () => chatSelector(useBoundStore.getState());
export const getAccessToken = () => accessTokenSelector(useBoundStore.getState());
export const getOpenAlert = () => openAlertSelector(useBoundStore.getState());
export const getAlertMessage = () => alertMessageSelector(useBoundStore.getState());
export const getSelectedMenu = () => selectedMenuSelector(useBoundStore.getState());
export const getIsGlobalModal = () => isGlobalModalSelector(useBoundStore.getState());
export const getConferenceId = () => conferenceIdSelector(useBoundStore.getState());
export const getIsCreatedRoom = () => isCreatedRoomSelector(useBoundStore.getState());
export const getJoinUser = () => joinUserSelector(useBoundStore.getState());
export const getChatGroupList = () => chatGroupListSelector(useBoundStore.getState());
export const getSelectedGroupId = () => selectedGroupIdSelector(useBoundStore.getState());

export const getCanvas = () => canvasSelector(useBoundStore.getState());
export const getColor = () => colorSelector(useBoundStore.getState());


export const getActions = () => ({
  setGuests: useBoundStore.getState().setGuests,
  setUser: useBoundStore.getState().setUser,
  setChat: useBoundStore.getState().setRoomId,
  setAccessToken: useBoundStore.getState().setAccessToken,
  setOpenAlert: useBoundStore.getState().setOpenAlert,
  setAlertMessage: useBoundStore.getState().setAlertMessage,
  setSelectedMenu: useBoundStore.getState().setSelectedMenu,
  setIsGlobalModal: useBoundStore.getState().setIsGlobalModal,
  setConferenceId: useBoundStore.getState().setConferenceId,
  setIsCreatedRoom: useBoundStore.getState().setIsCreatedRoom,
  setJoinUser: useBoundStore.getState().setJoinUser,
  setChatGroupList: useBoundStore.getState().setChatGroupList,
  setSelectedGroupId: useBoundStore.getState().setSelectedGroupId,

  setCanvas: (canvas: fabric.Canvas | null) => useBoundStore.getState().setCanvas(canvas),
  setColor: (color: string) => useBoundStore.getState().setColor(color),

  clearAccessToken: () => useBoundStore.getState().clearAccessToken(),
  socketOpen: useBoundStore.getState().socketOpen,
  socketClose: useBoundStore.getState().socketClose,
  sendMessage: useBoundStore.getState().sendMessage,
  createChatRoom: useBoundStore.getState().createChatRoom,
  createConferenceRoom: useBoundStore.getState().createConferenceRoom,
  joinConferenceRoom: useBoundStore.getState().joinConferenceRoom,
  sendOffer: useBoundStore.getState().sendOffer,
  sendAnswer: useBoundStore.getState().sendAnswer,
  sendIcecandidate: useBoundStore.getState().sendIcecandidate,
  sendMediaState: useBoundStore.getState().sendMediaState
});
