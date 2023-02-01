declare global {
  interface Window {
    $IMA?: {
      SPA: boolean;
      $PublicPath: string;
      $Language: string;
      $Env: string;
      $Debug: boolean;
      $Version: string;
      $App: string;
      $Protocol: string;
      $Host: string;
      $Path: string;
      $Root: string;
      $LanguagePartPath: string;
      Runner: string;
      Cache: object;
      i18n?: object;
    };
  }
}

export {};
