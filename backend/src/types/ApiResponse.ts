export interface MessageResponse {
    message: string;
}

export interface CreateResponse
    extends MessageResponse {
    id: number;
}