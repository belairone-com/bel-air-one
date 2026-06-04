/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly SITE_ACCESS_PASSWORD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
