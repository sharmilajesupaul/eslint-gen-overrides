export interface ESLintOverride {
  rules: {
    [key: string]: 'error' | 'warn' | 'off' | 0 | 1 | 2;
  };
  files: string[];
}

export type ESLintOverrides = ESLintOverride[];
