import { Album } from "../models/album.model";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (error) {
    next(error);
  }
};

export const getAlbumsById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await Album.findById(albumId).populate("songs");

    if (!album) {
      return res.status(400).json({
        message: "Album not found",
      });
    }
    res.json(album);
  } catch (error) {
    next(error);
  }
};
