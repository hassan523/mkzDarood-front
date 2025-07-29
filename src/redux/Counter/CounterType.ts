export interface GetCounterResponse {
     seq: number;
}

export interface UpdateCounterRequest{
     seq: number;
     Token: string;
}