import * as folderService  from '../services/folderService.js';

export const  getAllFolders = async (req, res) => {
  try {
    const folders = await folderService.findAllFolders(req.query);
    return res.status(200).json(folders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const getFolderById = async (req, res) => {
  try {
    const { id } = req.params; 
    const data = await folderService.findFolderById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRootFolders = async (req, res) => {
  try {
    const data = await folderService.findRootFolders();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
