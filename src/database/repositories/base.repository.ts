export interface BaseRepository<T> {
  getById(id: number): Promise<T>;
  getAll?(): Promise<T[]>;
  create?(data): Promise<T>;
  update?(data): Promise<T>;
  delete?(data): Promise<T>;
}
