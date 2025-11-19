export enum DataFormat {
  JSON = 'JSON',
  CSV = 'CSV',
  TOON = 'TOON CODE'
}

export interface ConversionRequest {
  data: string;
  fromFormat: DataFormat;
  toFormat: DataFormat;
}

export interface ConversionResponse {
  result: string;
  error?: string;
}

export interface TokenCounts {
  gemini: number;
  openai: number;
  lovable: number;
}