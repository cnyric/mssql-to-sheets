import type { GaxiosResponse } from 'gaxios';
import type { sheets_v4 } from 'googleapis';

interface SheetInfo extends GaxiosResponse<sheets_v4.Schema$Spreadsheet> {}

interface SheetProperties extends sheets_v4.Schema$SheetProperties {}

export type { SheetInfo, SheetProperties };
