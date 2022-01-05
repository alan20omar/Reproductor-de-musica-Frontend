import SongModel from "./song";

export default interface SongTail {
    index: number;
    song: SongModel;
    isLoading: boolean;
}