import { useLogin } from "@/context/LoginContext";
import TextInput from "../common/TextInput/TextInput";
import ValidationMessage from "../common/ValidationMessage/ValidationMessage";

export default function CommonInfoForm() {
  const { inputs, inputErrors, isLoading, handleChange, handleFieldBlur } =
    useLogin();

  return (
    <>
      <TextInput
        name="email"
        type="email"
        value={inputs.email}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        disabled={isLoading}
      />
      {inputErrors.email && <ValidationMessage message={inputErrors.email} />}
      <TextInput
        name="password"
        type="password"
        value={inputs.password}
        onChange={handleChange}
        onBlur={handleFieldBlur}
        disabled={isLoading}
      />
      {inputErrors.password && (
        <ValidationMessage message={inputErrors.password} />
      )}
    </>
  );
}
