import TextInput from "../common/TextInput/TextInput";
import ValidationMessage from "../common/ValidationMessage/ValidationMessage";
import useUserStore from '@/stores/useUserStore';

export default function CommonInfoForm() {
  const { user, inputErrors, isLoading, inputChange, fieldBlur } = useUserStore();

  return (
    <>
      <TextInput
        name="email"
        type="email"
        value={user.email}
        onChange={inputChange}
        onBlur={fieldBlur}
        disabled={isLoading}
      />
      {inputErrors.email && <ValidationMessage message={inputErrors.email} />}
      <TextInput
        name="password"
        type="password"
        value={user.password}
        onChange={inputChange}
        onBlur={fieldBlur}
        disabled={isLoading}
      />
      {inputErrors.password && (
        <ValidationMessage message={inputErrors.password} />
      )}
    </>
  );
}
