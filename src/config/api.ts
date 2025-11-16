// Configuração centralizada da API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  lares: `${API_BASE_URL}/lares`,
  solicitacoes: `${API_BASE_URL}/solicitacoes`,
};

// Helper para construir URLs de uploads
export const getUploadUrl = (path: string) => {
  if (!path) return '';
  
  // Se já for URL completa, retorna direto
  if (path.startsWith('http')) return path;
  
  // Remove /api/ e adiciona a base URL sem /api
  const baseUrl = API_BASE_URL.replace('/api', '');
  
  // Remove barra inicial se existir
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `${baseUrl}/${cleanPath}`;
};

// Log para debug (só em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    mode: import.meta.env.MODE,
    apiUrl: API_BASE_URL,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  });
}
