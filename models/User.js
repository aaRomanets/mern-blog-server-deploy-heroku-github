import mongoose from "mongoose";

//модель базы данных регистрируемого пользователя
const UserSchema = new mongoose.Schema({
    //полное имя регистрируемого пользователя
    fullname: {
        type: String,
        required: true
    },
    //почта регистрируемого пользователя
    email: {
        type: String,
        required: true,
        unique: true
    },
    //зашифрованный пароль регистрируемого пользователя
    passwordHash: {
        type: String,
        required: true
    },
    //аватарка регистрируемого пользователя
    avatarUrl: String
}, {
    timestamps: true
})

export default mongoose.model('User', UserSchema);