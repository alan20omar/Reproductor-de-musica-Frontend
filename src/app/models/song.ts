import { SafeUrl } from "@angular/platform-browser";

interface SongModel{
    _id: string;
    title: string;
    artist: string;
    album: string;
    genre: string;
    trackNumber: string;
    // image?: any;
    imagePath?: SafeUrl;
    filePath?: SafeUrl;
}

export default SongModel;