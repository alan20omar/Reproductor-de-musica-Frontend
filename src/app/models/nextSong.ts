import SongModel from "./song";

export default interface NextSong {
    song: SongModel,
    playNext: boolean
}