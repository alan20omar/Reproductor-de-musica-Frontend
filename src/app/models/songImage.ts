interface BufferModel{
    type: string,
    data: ArrayBuffer
}

interface TypeModel{
    id: Number,
    name: string
}

interface ImageModel {
    mime: string,
    type: TypeModel,
    description: string,
    imageBuffer: BufferModel
}

export default interface SongImageModel {
    image: ImageModel,
    _id: string
}