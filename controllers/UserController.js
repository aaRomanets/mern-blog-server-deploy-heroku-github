import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 

import UserModel from '../models/User.js';

//функция регистрации пользователя
export const register = async (req, res) => 
{
  try 
  {
    //ищем пользователя в модели базы данных UserModel
    const userExist = await UserModel.findOne({ email: req.body.email});

    //существующего пользователя удаляем из базы данных
    if (userExist != undefined)
    {
      UserModel.findOneAndDelete(
      {
        email: req.body.email
      },
      (err, doc) => {
      });
    }
    
	  //шифруем пароль регистрируемого пользователя
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    //составляем модель в базе данных MongoDB по регистрируемому пользователю
    const doc = new UserModel({
      email: req.body.email,
      fullname: req.body.fullname,
      avatarUrl: req.body.avatarUrl ? req.body.avatarUrl : '',
      passwordHash: hash
    });
    //фиксируем данные в базу данных MongoDB по регистрируемому пользователю
    const user = await doc.save();
    //составляем токен зарегистрированного пользователя
    const token = jwt.sign({
      _id: user._id
    },  
    'secret123',
    {
      expiresIn: '30d'            
    })
    //собираем все данные по регистрируемому пользователю из базы данных включая зашифрованный пароль
    const {passwordHash, ...userData} = user._doc;
    //отправляем все данные по зарегистрированному пользователю, включая токен на фронтенд
    res.json({
      ...userData,
      token
    });
  }
  catch (err)
  {
    res.status(500).json({
      message: 'Failed to register'
    });
  }
}

//функция авторизации пользователя
export const login = async (req, res) => {
    try 
    {
        //ищем пользователя в модели базы данных UserModel
        const user = await UserModel.findOne({ email: req.body.email});

        if (!user) {
            return req.status(404).json({
                message: 'User not found'
            })
        }

        //Проверяем правильность пароля авторизируемого пользователя
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if (!isValidPass) {
            return req.status(400).json({
                message: 'Invalid username or password'
            })
        }

        //составляем токен авторизируемого пользователя (этим действием проводим указанную авторизацию)
        const token = jwt.sign({
            _id: user._id
        },
        'secret123',
        {
            expiresIn: '30d'            
        })

        //собираем все данные по уже авторизированному пользователю
        const {passwordHash, ...userData} = user._doc;

        //отправлем на клиент часть все данные по уже авторизованному пользователю включая его токен
        res.json({
            ...userData,
            token
        });
    } 
    catch (err) 
    {
        res.status(500).json({
            message: 'Failed to log in'
        });
    }
}

//функция получения информации об авторизованном пользователе
export const getMe =  async (req,res) => {
    try
    {
        //из базы данных MongoDb собираем все данные по пользователю с идентификатором req.userId
        const user = await UserModel.findById(req.userId);

        if (!user)
        {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        //собираем все данные по пользователю с идентификатором req.userId
        const {passwordHash, ...userData} = user._doc;

        //отправлем на клиент часть все данные по пользователю с идентификатором req.userId
        res.json({...userData});
    }
    catch (err)
    {
        res.status(500).json({
            message: 'No access'
        })
    }
}