const tagsModel = require('../models/tags-model.js');
const sanitize = require('mongoose-sanitize');

const findTags = () => tagsModel.find();
const findTagById = (tid) => tagsModel.findById({_id: tid});
const findTagByName = (name) => {
    const sanitizedName = sanitize(name);
    tagsModel.find({name: sanitizedName})
}
const createTag = (tag) => tagsModel.create(tag);
const deleteTag = (tid) => tagsModel.deleteOne({_id: tid});
const updateTag = (tid, tag) => {
    const sanitizedId = sanitize(tid);
    const sanitizedTag = sanitize(tag);
    tagsModel.updateOne({_id: sanitizedId}, {$set: sanitizedTag})
}

const tagCreate = async (tag) => {
    const newTagName = tag.name;
    console.log(newTagName);
    const tags = await findTagByName(newTagName);
    console.log(tags)
    let cTag = ''
    if (tags.length === 0) {
        cTag = await createTag(tag);
    } else {
        cTag = tags[0]._id;
    }
    return cTag;
}

module.exports = {
    findTags,
    findTagById,
    findTagByName,
    createTag,
    deleteTag,
    updateTag,
    tagCreate
};