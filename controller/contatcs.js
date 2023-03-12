const service = require('../service/contatcs');

const get = async (req, res, next) => {
  try {
    const user = req.user;
    let page = req.query.page || 0;
    let size = req.query.size || 0;

    const limit = parseInt(size);
    const index = parseInt(page);

    const result = await service.getAllContacts(user.id, index, limit);
    res.send({page, size, result})  
  } catch(error) {
    next(error);
  }
}

const getById = async (req, res, next) => {
  const id = req.params;
  try {
    const user = req.user;

    const result = await service.getContactById(id.contactId, user.id);
    if(!result) {
      res.status(404).json({"message": "Not found contact with that id."})
    }
    res.status(200).json(result)  
  } catch(error) {
    next(error);
  }
}

const create = async (req, res, next) => {
  try {
    const user = req.user;
    const contact = req.body;
    contact.owner = user.id;
    const result = await service.addContact(contact)
    res.status(201).json(result)
  } catch (error) {
    next(error);
  }
}

const remove = async (req, res, next) => {
  try {
    const id = req.params;
    const user = req.user;
    const contact = await service.getContactById(id.contactId, user.id)
    if (!contact) {
      res.status(404).json({"message": "Not found contact with that id."})
    }
    const result = await service.removeContact(id.contactId);
    if(!result) {
      res.status(404).json({"message": "Not found contact with that id."})
    }
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

const update = async (req, res, next) => {
  const id = req.params;
  const info = req.body;
  try {
    const user = req.user;
    const contact = await service.getContactById(id.contactId, user.id)
    if (!contact) {
      res.status(404).json({"message": "Not found contact with that id."})
    } 
    if(!Object.keys(info).length) {
      res.status(400).json({"message": "Missing all field."})
    }
    const result = await service.updateContact(id.contactId, info);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

const updateFav = async (req, res, next) => {
  const id = req.params;
  const info = req.body;
  try {
    const user = req.user;
    const contact = await service.getContactById(id.contactId, user.id)
    if (!contact) {
      res.status(404).json({"message": "Not found contact with that id."})
    } 
    if(!Object.keys(info).includes('favorite')) {
      res.status(400).json({"message": "Missing field favorite."})
    }
    const result = await service.updateContact(id.contactId, info);
    res.status(200).json(result)
  } catch (error) {
    next(error);
  }
}

module.exports = {
  get, 
  getById,
  create,
  remove,
  update,
  updateFav
}