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

export type { MarkingPeriod, Progress };
