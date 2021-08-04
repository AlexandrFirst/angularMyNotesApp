import { UploadResponse } from "@kolkov/angular-editor";

export class UploadPhoto implements UploadResponse {
    public imagePublicId: string;
    public imageUrl: string;
}