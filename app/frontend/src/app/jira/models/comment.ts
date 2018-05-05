import { Profile } from "./profile";

export interface Comment {
    author: Profile;
    body: string;
    updateAuthor: Profile;
    created: Date;
    updated: Date;

    updatedString?: string;
}
