interface MPBase {
  District?: string;
  Site?: string;
  URL?: string;
  Building?: string;
  SchoolLevel?: string;
  StartDate?: string;
  EndDate?: string;
  UnlockDate?: string;
  LockDate?: string;
  Contact?: string;
  PrintDate?: string;
  ID?: number;
}

interface MarkingPeriod extends MPBase {
  MarkingPeriod?: string;
}

interface Progress extends MPBase {
  ProgressReport?: string;
}

interface EnvVarsv {
  DB_HOST: string;
  DB_USER: string;
  DB_PASS: string;
  PORT?: number;
  ERROR_LOG_PATH?: string;
  STORE_PATH?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVars {}
  }
}

export type { MarkingPeriod, Progress };
