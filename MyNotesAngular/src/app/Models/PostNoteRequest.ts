import { UploadPhoto } from "./UploadPhoto";

export class PostNoteRequest {
    NoteText: string;
    UploadImages: UploadPhoto[];
    TitleImage: UploadPhoto;
}