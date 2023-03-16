import jwt from 'jsonwebtoken'

//проверка авторизации пользователя
export default (req, res, next) => {
    //смотрим есть ли токен авторизованного пользователя
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if (token)
    {
        try 
        {
            //токен авторизованного пользователя есть, определяем идентификатор авторизованного пользователя req.userId 
            const decoded = jwt.verify(token, 'secret123');
            req.userId = decoded._id;
            next();
        } 
        catch (e) 
        {
            return res.status(403).json({
                message: 'No access'
            })
        }
    }
    else
    {
        return res.status(403).json({
            message: 'No access'
        })
    }
}