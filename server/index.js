import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { loginValidation, registerValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import { register, login, getMe } from './controllers/UserController.js';
import { create, getAll, remove, getOne, update, getLastTags } from './controllers/PostControllers.js';
import handleValidationsErrors from './utils/handleValidationsErrors.js';

mongoose.connect('mongodb+srv://mark:kaccel2010@cluster0.yfahk.mongodb.net/blog?retryWrites=true&w=majority')
        .then(() => {
            console.log('Database OK')
        }).catch((err) => {console.log(err)})

const PORT = 5000;

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });
// хранилище для изображений

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/login', loginValidation, handleValidationsErrors, login);
app.post('/auth/register', registerValidation, handleValidationsErrors, register);
app.get('/auth/me', checkAuth, getMe);
app.post('/posts', checkAuth, postCreateValidation, handleValidationsErrors, create);
app.get('/posts', checkAuth, getAll);
app.get('/posts/:id', checkAuth, getOne);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationsErrors, update);
app.get('/tags', getLastTags);
// по логике на любые попрытки изменить пост надо проверять аус

app.listen(PORT, (err) => err ? console.log(err) : console.log(`Server has started on port ${PORT}`));