import mongoose from "mongoose";

//модель статьи, создаваемая авторизованным пользователем
const ArticleSchema = new mongoose.Schema({
    //заголовок статьи
    title: {
        type: String,
        required: true
    },
    //текстовое содержимое статьи
    text: {
        type: String,
        required: true,
        unique: true
    },
    //массив тегов статьи
    tags: {
        type: Array,
        default: []
    },
    viewsCount: {
        type: Number,
        default: 0    
    },
    //зарегистрированный пользователь, который создал эту статью
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //изображение статьи
    imageUrl: String
}, {
    timestamps: true
})

export default mongoose.model('Article', ArticleSchema);