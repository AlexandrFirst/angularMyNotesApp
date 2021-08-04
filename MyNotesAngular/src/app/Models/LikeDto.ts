import { NoteDto } from "./NoteDto";
import { UserPostDto } from "./UserPostDto";

export class LikeDto {
    user: UserPostDto;
    note: NoteDto;
    repostDate: Date;
}