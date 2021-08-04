import { LikeDto } from "./LikeDto";
import { RepostDto } from "./RepostDto";
import { UploadPhoto } from "./UploadPhoto";
import { UserPostDto } from "./UserPostDto";

export class NoteDto {
    noteId: number;
    content: string;
    publicationDate: Date;
    author: UserPostDto;
    titleImage: UploadPhoto;
    likes: LikeDto[];
    reposts: RepostDto[];
}