import type { GaxiosResponse } from 'gaxios';
import type { sheets_v4 } from 'googleapis';

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

interface SheetInfo extends GaxiosResponse<sheets_v4.Schema$Spreadsheet> {}

interface SheetProperties extends sheets_v4.Schema$SheetProperties {}

interface WrappedSheetProperties {
  properties: SheetProperties;
}

export type { MarkingPeriod, Progress, SheetInfo, SheetProperties };
