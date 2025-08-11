import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import {
  filterNameInput,
  filterPhoneInput,
  validateEmail,
  validateInputs,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/validation";


export type TInputs = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type State = {
  isLogin: boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;

  inputs: TInputs;
  setInputs: React.Dispatch<React.SetStateAction<TInputs>>;
  inputErrors: TInputs;
  setInputErrors: React.Dispatch<React.SetStateAction<TInputs>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isValidInput: boolean;
  setIsValidInput: React.Dispatch<React.SetStateAction<boolean>>;

  toggleIsLogin: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleFieldBlur: (e: FocusEvent<HTMLInputElement>) => void;
};

const LoginContext = createContext<State>({} as State);

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const rememberedEmail = localStorage.getItem("userEmail");
  const [isLogin, setIsLogin] = useState(true);
  const [inputs, setInputs] = useState<TInputs>({
    name: "",
    phone: "",
    email: rememberedEmail || "",
    password: "",
  });
  const [inputErrors, setInputErrors] = useState<TInputs>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);

  const toggleIsLogin = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "phone") {
      filteredValue = filterPhoneInput(value);
    } else if (name === "name") {
      filteredValue = filterNameInput(value);
    }

    setInputs((prev) => ({ ...prev, [name]: filteredValue }));

    // 입력 시 해당 필드의 에러 메시지 초기화
    setInputErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFieldBlur = (e: FocusEvent<HTMLInputElement>) => {
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

    setInputErrors((prev) => ({
      ...prev,
      [name]: validation.isValid ? "" : validation.message,
    }));
  };

  useEffect(() => {
    const { isValid } = validateInputs(isLogin, inputs);

    setIsValidInput(isValid);
  }, [inputs, isLogin]);

  return (
    <LoginContext.Provider
      value={{
        isLogin,
        setIsLogin,
        inputs,
        setInputs,
        inputErrors,
        setInputErrors,
        isLoading,
        setIsLoading,
        isValidInput,
        setIsValidInput,
        toggleIsLogin,
        handleChange,
        handleFieldBlur,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export const useLogin = () => useContext(LoginContext);
