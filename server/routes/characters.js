const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const charactersController = require('../controllers/characters');

// 获取所有角色
router.get('/', charactersController.getAllCharacters);

// 获取单个角色
router.get('/:id', charactersController.getCharacter);

// 创建角色
router.post('/', upload.single('image'), charactersController.createCharacter);

// 更新角色
router.put('/:id', upload.single('image'), charactersController.updateCharacter);

// 删除角色
router.delete('/:id', charactersController.deleteCharacter);

module.exports = router;