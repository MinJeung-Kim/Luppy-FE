// 정규표현식 상수
const EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const PHONE_NUMBER_REGEX = /^\d{11}$/; // 숫자만 11자리

// 최소 길이 상수
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 15;

// 개별 유효성 검사 함수들
export const validateEmail = (email: string) => {
  if (!email) {
    return { isValid: false, message: "이메일을 입력해주세요." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: "유효한 이메일을 입력해주세요." };
  }
  return { isValid: true, message: "" };
};

export const validatePassword = (password: string) => {
  if (!password) {
    return { isValid: false, message: "비밀번호를 입력해주세요." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`,
    };
  }
  return { isValid: true, message: "" };
};

export const validateName = (name: string) => {
  if (!name) {
    return { isValid: false, message: "이름을 입력해주세요." };
  }
  // 완성형 한글만 허용 (자음/모음만 있는 경우는 유효하지 않음)
  if (!/^[가-힣\s]+$/.test(name)) {
    return { isValid: false, message: "이름은 완성된 한글만 입력 가능합니다." };
  }
  if (name.trim().length < MIN_NAME_LENGTH) {
    return {
      isValid: false,
      message: `이름은 ${MIN_NAME_LENGTH}자 이상이어야 합니다.`,
    };
  }
  if (name.trim().length > MAX_NAME_LENGTH) {
    return {
      isValid: false,
      message: `이름은 ${MAX_NAME_LENGTH}자를 초과할 수 없습니다.`,
    };
  }
  return { isValid: true, message: "" };
};

export const validatePhone = (phone: string) => {
  if (!phone) {
    return { isValid: false, message: "전화번호를 입력해주세요." };
  }
  if (!PHONE_NUMBER_REGEX.test(phone)) {
    return {
      isValid: false,
      message: "전화번호는 숫자 11자리만 입력해주세요.",
    };
  }
  if (
    !phone.startsWith("010") &&
    !phone.startsWith("011") &&
    !phone.startsWith("016") &&
    !phone.startsWith("017") &&
    !phone.startsWith("018") &&
    !phone.startsWith("019")
  ) {
    return { isValid: false, message: "유효한 전화번호 형식이 아닙니다." };
  }
  return { isValid: true, message: "" };
};

// 메인 유효성 검사 함수
export const validateInputs = (
  isLogin: boolean,
  inputs: {
    email: string;
    phone: string;
    password: string;
    name: string;
  }
) => {
  const { email, phone, password, name } = inputs;

  // 공통 필수 필드 검사 (이메일, 비밀번호)
  const emailValidation = validateEmail(email);
  if (!emailValidation.isValid) {
    return emailValidation;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return passwordValidation;
  }

  // 회원가입 시 추가 필드 검사
  if (!isLogin) {
    const nameValidation = validateName(name);
    if (!nameValidation.isValid) {
      return nameValidation;
    }

    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.isValid) {
      return phoneValidation;
    }
  }

  return { isValid: true, message: "" };
};

// 입력 방어 로직 헬퍼 함수들
export const filterPhoneInput = (value: string): string => {
  // 숫자만 추출하고 11자리로 제한
  const numbersOnly = value.replace(/\D/g, "");
  return numbersOnly.slice(0, 11);
};

export const filterNameInput = (value: string): string => {
  // 길이 제한만 적용하고 한글 입력은 자유롭게 허용
  return value.slice(0, 15);
};

// 전화번호 포맷팅 함수
export const formatPhoneNumber = (phone: string): string => {
  // 숫자만 추출
  const numbersOnly = phone.replace(/\D/g, "");

  // 11자리가 아니면 원본 반환
  if (numbersOnly.length !== 11) {
    return phone;
  }

  // 010-1234-5678 형식으로 포맷팅
  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
};
