import { UploadPhoto } from "./UploadPhoto";

export class PostNoteRequest {
    noteText: string;
    uploadImages: UploadPhoto[];
    titleImage: UploadPhoto;
}