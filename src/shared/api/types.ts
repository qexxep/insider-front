export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'SUCCESS' | 'FAILURE' | 'ERROR'; // TODO
}
