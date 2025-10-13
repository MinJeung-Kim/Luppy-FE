import type { ChangeEvent, FocusEvent } from 'react';
import { create } from 'zustand';
import { filterNameInput, filterPhoneInput, validateEmail, validateName, validatePassword, validatePhone, validateInputs } from '@/utils/validation';

type TInitUSer = {
    name: string;
    email: string;
    phone: string;
    profile: string;
    password: string;
}

type TInputErrors = {
    name: string;
    email: string;
    phone: string;
    password: string;
}

type UserStore = {
    // 사용자 정보
    user: TInitUSer;
    setUser: (user: TInitUSer) => void;

    // 로그인/회원가입 관련 상태
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
    toggleIsLogin: () => void;

    // 에러 메시지
    inputErrors: TInputErrors;
    setInputErrors: (errors: TInputErrors | ((prev: TInputErrors) => TInputErrors)) => void;
    resetInputErrors: () => void;

    // 로딩 상태
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;

    // 유효성 검사 상태
    isValidInput: boolean;
    updateValidation: () => void;

    // 이벤트 핸들러
    inputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    fieldBlur: (e: FocusEvent<HTMLInputElement>) => void;
};

const rememberedEmail = localStorage.getItem("userEmail");

const initialInputErrors: TInputErrors = {
    name: "",
    email: "",
    phone: "",
    password: ""
};

const useUserStore = create<UserStore>((set, get) => ({
    user: {
        name: "",
        phone: "",
        profile: "",
        email: rememberedEmail || "",
        password: "",
    },

    isLogin: true,
    setIsLogin: (isLogin) => {
        set({ isLogin });
        get().updateValidation();
    },
    toggleIsLogin: () => {
        set((state) => ({ isLogin: !state.isLogin }));
        get().updateValidation();
    },

    inputErrors: initialInputErrors,
    setInputErrors: (errors) => set((state) => ({
        inputErrors: typeof errors === 'function' ? errors(state.inputErrors) : errors
    })),
    resetInputErrors: () => set({ inputErrors: { ...initialInputErrors } }),

    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    isValidInput: false,
    updateValidation: () => {
        const state = get();
        const { isValid } = validateInputs(state.isLogin, state.user);

        set({ isValidInput: isValid });
    },

    setUser: (user) => set({ user }),

    inputChange: (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let filteredValue = value;

        if (name === "phone") {
            filteredValue = filterPhoneInput(value);
        } else if (name === "name") {
            filteredValue = filterNameInput(value);
        }

        set((state) => ({
            user: {
                ...state.user,
                [name]: filteredValue,
            },
            inputErrors: {
                ...state.inputErrors,
                [name]: ""
            }
        }));

        // 유효성 검사 업데이트
        get().updateValidation();
    },

    fieldBlur: (e: FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let validation;

        switch (name) {
            case "email":
                validation = validateEmail(value);
                break;
            case "password":
                validation = validatePassword(value);
                break;
            case "name":
                validation = validateName(value);
                break;
            case "phone":
                validation = validatePhone(value);
                break;
            default:
                return;
        }

        set((state) => ({
            inputErrors: {
                ...state.inputErrors,
                [name]: validation.isValid ? "" : validation.message,
            }
        }));
    },
}));

// 초기 유효성 검사 실행
useUserStore.getState().updateValidation();

export default useUserStore;
