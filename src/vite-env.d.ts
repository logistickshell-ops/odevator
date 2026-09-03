/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYMENT_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
