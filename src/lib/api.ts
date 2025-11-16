// api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3335/api";

// Registrar lar temporário
export async function registerHome(formData: FormData) {
  try {
    console.log("📌 Enviando FormData para o backend:", formData);

    const response = await fetch(`${API_BASE_URL}/lares`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao cadastrar lar");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao cadastrar lar:", error);
    throw error;
  }
}

// Solicitar estadia
export async function requestStay(formData: FormData) {
  try {
    console.log("📌 Enviando FormData de solicitação:", formData);

    const response = await fetch(`${API_BASE_URL}/solicitacoes`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao enviar solicitação");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar solicitação:", error);
    throw error;
  }
}
