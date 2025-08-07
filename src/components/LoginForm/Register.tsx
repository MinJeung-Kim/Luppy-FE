import { register } from "@/api/auth";
import { getActions } from '@/stores';
import { useLogin } from "@/context/LoginContext";
import { FORM_MESSAGES } from "@/constants/messages";
import { profileImages, randomIndex } from '@/utils/random-avatar';
import ValidationMessage from "@/components/common/ValidationMessage/ValidationMessage";
import TextInput from "@/components/common/TextInput/TextInput";
import Button from "@/components/common/Button/Button";
import CommonInfoForm from "./CommonInfoForm";

export default function Register() {
  const {
    inputs,
    isLoading,
    inputErrors,
    isValidInput,
    handleChange,
    handleFieldBlur,
    setIsLogin,
  } = useLogin();
  const { setOpenAlert, setAlertMessage } = getActions();

  const handleSignUp = async () => {
    const profile = profileImages[randomIndex]
    const result = await register(inputs, profile);
    console.log("Sign Up clicked : ", result);
    if (result.error) {
      setAlertMessage(result.error);
      setOpenAlert(true);
      return;
    }
    setIsLogin(true);
  };

  return (
    <>
      <CommonInfoForm />
      <TextInput
        name="name"
        value={inputs.name}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        disabled={isLoading}
      />
      {inputErrors.name && <ValidationMessage message={inputErrors.name} />}
      <TextInput
        name="phone"
        value={inputs.phone}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        disabled={isLoading}
      />
      {inputErrors.phone && <ValidationMessage message={inputErrors.phone} />}
      <Button
        text={
          isLoading
            ? FORM_MESSAGES.register.loading
            : FORM_MESSAGES.register.button
        }
        disabled={!isValidInput}
        onClick={handleSignUp}
      />
    </>
  );
}
