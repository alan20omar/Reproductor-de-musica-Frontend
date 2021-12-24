import { SafeUrl } from "@angular/platform-browser";

class SongModel{
    _id!: string;
    title!: string;
    artist!: string;
    album!: string;
    genre!: string;
    trackNumber!: string;
    image!: any;
    available!: Boolean;
    // file!: any;
    imagePath!: SafeUrl;
    filePath!: SafeUrl;
}

export default SongModel;