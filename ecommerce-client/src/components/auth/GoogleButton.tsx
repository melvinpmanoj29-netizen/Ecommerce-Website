import { GoogleLogin } from "@react-oauth/google";

interface GoogleButtonProps {
  onSuccess: (token: string) => void;
}

function GoogleButton({
  onSuccess
}: GoogleButtonProps) {
  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        if (credentialResponse.credential) {
          onSuccess(
            credentialResponse.credential
          );
        }
      }}
      onError={() => {
        console.error("Google login failed");
      }}
      useOneTap={false}
    />
  );
}

export default GoogleButton;