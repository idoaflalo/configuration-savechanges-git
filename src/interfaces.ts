export interface File {
  path: string;
  content: string;
}

export interface SaveChangesResult {
  isError: boolean;
  conflicts?: any;
}
