export interface NextParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}
