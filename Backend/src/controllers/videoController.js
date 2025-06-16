import * as videoService  from '../services/videoService.js';

export const getAllVideos = async (req, res) => {
    try {
        const videos = await videoService.findAllVideos(req.query);
        return res.status(200).json(videos);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params; 
    const data = await videoService.findVideoById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; 
    const updatedVideo = await videoService.updateVideoById(id, updateData);    
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
