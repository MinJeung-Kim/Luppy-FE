import { useBoundStore, type BoundState } from "./bound-store";

const guestsSelector = (state: BoundState) => state.guests;
const userSelector = (state: BoundState) => state.user;
const chatSelector = (state: BoundState) => state.roomId;
const socketSelector = (state: BoundState) => state.socket;
const accessTokenSelector = (state: BoundState) => state.accessToken;
const openAlertSelector = (state: BoundState) => state.openAlert;
const alertMessageSelector = (state: BoundState) => state.alertMessage;
const selectedMenuSelector = (state: BoundState) => state.selectedMenu;

export const useGuests = () => useBoundStore(guestsSelector);
export const useUser = () => useBoundStore(userSelector);
export const useChat = () => useBoundStore(chatSelector);
export const useSocket = () => useBoundStore(socketSelector);
export const useAccessToken = () => useBoundStore(accessTokenSelector);
export const useOpenAlert = () => useBoundStore(openAlertSelector);
export const useAlertMessage = () => useBoundStore(alertMessageSelector);
export const useSelectedMenu = () =>
  useBoundStore(selectedMenuSelector);

// 상태 변경 시 컴포넌트가 리렌더링되지 않음
export const getGuests = () => guestsSelector(useBoundStore.getState());
export const getUser = () => userSelector(useBoundStore.getState());
export const getChat = () => chatSelector(useBoundStore.getState());
export const getAccessToken = () => accessTokenSelector(useBoundStore.getState());
export const getOpenAlert = () => openAlertSelector(useBoundStore.getState());
export const getAlertMessage = () => alertMessageSelector(useBoundStore.getState());
export const getSelectedMenu = () => selectedMenuSelector(useBoundStore.getState());


export const getActions = () => ({
  setGuests: useBoundStore.getState().setGuests,
  setUser: useBoundStore.getState().setUser,
  setChat: useBoundStore.getState().setRoomId,
  setAccessToken: useBoundStore.getState().setAccessToken,
  setOpenAlert: useBoundStore.getState().setOpenAlert,
  setAlertMessage: useBoundStore.getState().setAlertMessage,
  setSelectedMenu: useBoundStore.getState().setSelectedMenu,

  clearAccessToken: () => useBoundStore.getState().clearAccessToken(),
  socketOpen: useBoundStore.getState().socketOpen,
  socketClose: useBoundStore.getState().socketClose,
  sendMessage: useBoundStore.getState().sendMessage,
  createChatRoom: useBoundStore.getState().createChatRoom,
});
