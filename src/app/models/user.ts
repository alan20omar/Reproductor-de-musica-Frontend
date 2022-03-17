export default interface UserModel{
    _id: string,
    name: string,
    last_name: string,
    email: string,
    volume: number,
    play_queue: string[],
    actual_index_song: number,
    updatedAt: Date,
    createdAt: Date,
}