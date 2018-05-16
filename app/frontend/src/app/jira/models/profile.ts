import { SafeUrl } from "@angular/platform-browser";

export interface Profile {
    emailAddress: string;
    avatarUrls: {
        "48x48": string;
        "24x24": string;
        "16x16": string;
        "32x32": string;
    };
    name: string;
    key: string;
    displayName: string;
    active: boolean;
    safeAvatarUrl?: SafeUrl;
}
