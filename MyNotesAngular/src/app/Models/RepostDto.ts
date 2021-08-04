import { NoteDto } from "./NoteDto";
import { UserPostDto } from "./UserPostDto";

export class RepostDto {
    user: UserPostDto;
    note: NoteDto;
    repostDate: RepostDto;
}