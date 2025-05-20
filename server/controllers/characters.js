const Character = require('../models/Character');
const path = require('path');
const fs = require('fs');


exports.getAllCharacters = async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
      
      const result = await Character.findWithPagination(page, limit, search);
      res.json(result);
  } catch (error) {
      console.error('Error fetching characters:', error);
      res.status(500).json({ message: 'Error fetching characters' });
  }
};

exports.getCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    if (!character) {
      return res.status(404).json({ message: 'Character not found' });
    }
    
    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ message: 'Error fetching character' });
  }
};

exports.createCharacter = async (req, res) => {
  try {
    const { name, abyss_rating, pvp_rating, high_pressure_rating, 
            single_target_rating, multi_target_rating, stamina_rating } = req.body;
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const id = await Character.create({
      name, 
      image_path: imagePath,
      abyss_rating, 
      pvp_rating, 
      high_pressure_rating, 
      single_target_rating, 
      multi_target_rating, 
      stamina_rating
    });
    
    res.status(201).json({ 
      message: 'Character created successfully', 
      id
    });
  } catch (error) {
    console.error('Error creating character:', error);
    res.status(500).json({ message: 'Error creating character' });
  }
};

exports.updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, abyss_rating, pvp_rating, high_pressure_rating, 
            single_target_rating, multi_target_rating, stamina_rating } = req.body;
    
    // 获取当前图片路径
    const currentImagePath = await Character.getImagePath(id);
    let imagePath = currentImagePath;
    
    // 如果有新图片上传
    if (req.file) {
      // 删除旧图片
      if (currentImagePath) {
        const oldImagePath = path.join(__dirname, '../', currentImagePath);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    await Character.update(id, {
      name, 
      image_path: imagePath,
      abyss_rating, 
      pvp_rating, 
      high_pressure_rating, 
      single_target_rating, 
      multi_target_rating, 
      stamina_rating
    });
    
    res.json({ message: 'Character updated successfully' });
  } catch (error) {
    console.error('Error updating character:', error);
    res.status(500).json({ message: 'Error updating character' });
  }
};

exports.deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 获取图片路径并删除图片
    const imagePath = await Character.getImagePath(id);
    if (imagePath) {
      const fullPath = path.join(__dirname, '../', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    await Character.delete(id);
    
    res.json({ message: 'Character deleted successfully' });
  } catch (error) {
    console.error('Error deleting character:', error);
    res.status(500).json({ message: 'Error deleting character' });
  }
};