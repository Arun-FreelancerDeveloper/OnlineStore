export interface ApiResponse<T> {
  success: boolean;
  count: number;
  data: T;
}

export interface ApiPaginationResponse<T> {
  success: boolean;
  message: string;
  data: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
    data: T[];
  };
}
