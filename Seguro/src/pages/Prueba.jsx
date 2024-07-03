import { useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import axios from "axios";

export default function Prueba() {
  const [token, setToken] = useState(null);
  const [verificationResult, setVerificationResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (token) {
      try {
        const secretKey = "ES_27a6080967b640b68e6b52f3c35abb66";
        const response = await axios.post(
          `https://hcaptcha.com/siteverify`,
          null,
          {
            params: {
              secret: secretKey,
              response: token,
            },
          }
        );

        const { success } = response.data;
        if (success) {
          setVerificationResult("Validación exitosa");
        } else {
          setVerificationResult("Falló la validación de hCaptcha");
        }
      } catch (error) {
        setVerificationResult("Error en la validación de hCaptcha");
      }
    } else {
      setVerificationResult("Por favor, completa el hCaptcha");
    }
  };

  const handleVerificationSuccess = (token) => {
    setToken(token);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Otros campos del formulario */}
        <HCaptcha
          sitekey="2174a10a-f572-4c58-9332-f76230aed0e8"
          onVerify={handleVerificationSuccess}
        />
        <button type="submit">Enviar</button>
      </form>
      {verificationResult && <p>{verificationResult}</p>}
    </div>
  );
}
