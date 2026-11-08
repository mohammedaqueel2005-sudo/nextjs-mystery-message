import { Message } from "@/models/User";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messges?: Array<Message>;
}