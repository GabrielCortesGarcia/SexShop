/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MP_PUBLIC_KEY: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Para que TypeScript sepa que existe window.MercadoPago
interface Window {
  MercadoPago?: any;
}
