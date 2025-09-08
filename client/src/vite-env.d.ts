/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_DOMAIN: string
  // add more environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}