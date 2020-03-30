export interface File {
  path: string;
  content: string;
}

export interface SaveChangesResult {
  isError: boolean;
  errorDetails?: string;
  conflictedFiles?: File[];
}
