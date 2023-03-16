import ArticleModel from '../models/Article.js'

//функция получения последних тэгов из базы данных ArticleModel по последним пяти статьям
export const getLastTags = async (req, res) => {
    try
    {
	    //вытаскиваем список пяти статей из базы данных PaperModel
        const articles = await ArticleModel.find().limit(5).exec();
	    //вытаскиваем все тэги из полученного списка статей 
        const tags = articles.map((obj) => obj.tags).flat().slice(0, 5);
  	    //отправляем полученные тэги на фронтенд
        res.json(tags);
    }
    catch (err)
    {
        res.status(500).json({
            message: 'Could not get the tags'
        })
    }    
}

//функция получения всех статей из базы данных ArticleModel
export const getAll = async (req, res) => {
    try
    {
        //вытаскиваем список статей из базы данных ArticleModel с развернутой информацией о пользователе, который написал каждую статью
        const articles = await ArticleModel.find().populate('user').exec();
       //отправляем полученый список всех статей на фронтенд
        res.json(articles);
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({
            message: 'Could not get the articles'
        })
    }
}

//функция получения одной статьи с идентификатором articleId
export const getOne = async (req, res) => {
    try
    {
        //выделяем идентификатор статьи articleId, по которому вытаскиваем статью из модели ArticleModel 
        const articleId = req.params.id;
        ArticleModel.findOneAndUpdate(
            {
                _id: articleId
            },
            {
                //количество просмотров статьи с идентификатором articleId увеличиваем на единицу
                $inc: {viewsCount: 1} 
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                //ошибка при получении статьи
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Could not get the article'
                    })                   
                }

                //статьи с идентификатором articleId нет 
                if (!doc)
                {
                    return res.status(404).json({
                        message: 'Artice not found'
                    })
                }
                //отправляем искомую статью
                res.json(doc);
            }
        ).populate('user');
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({
            message: 'Could not get the article'
        })
    }
}

//функция удаления статьи с идентификатором req.params.id
export const remove = async (req, res) => {
    try
    {
        //определяем идентификатор удаляемой статьи
        const articleId = req.params.id;
        //удаляем соответствующую статью
        ArticleModel.findOneAndDelete(
            {
                _id: articleId
            },
            (err, doc) => {
                //ошибка при удалении статьи
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Could not get the article'
                    })
                }
                //статья, которую нужно удалить не найдена
                if (!doc) {
                    return res.status(404).json({
                        message: 'Article not found'
                    })
                }
                //статья, которую нужно удалить, удалена
                res.json({
                    success: true
                })
            }
        )
        
    }
    catch (err)
    {
        console.log(err);
        res.status(500).json({
            message: 'Could not remove the article'
        })
    }
}

//функция создания статьи
export const create = async (req, res) => {
    try 
    {
        const doc = new ArticleModel({
	        //заголовок статьи
            title: req.body.title,
            //текстовое содержимое статьи
            text: req.body.text,
            //изображение в статье
            imageUrl: req.body.imageUrl,
            //тэги статьи
            tags: req.body.tags.split(','),
            //идентификатор пользователя, который составил эту статью
            user: req.userId
        })

        //фиксируем новую статью в базе данных
        const article = await doc.save();
        //отправляем всю информацию по новой статье на frontend
        res.json(article);
    }
    catch (err)
    {
        res.status(500).json({
            message: 'Could not create the article'
        })
    }
}

//функция редактирования статьи
export const update = async (req, res) =>
{
    try 
    {
        //определяем идентификатор редактируемой статьи
        const articleId = req.params.id;
        //редактируем соответствующую статью
        await ArticleModel.updateOne(
            {
                _id: articleId
            },
            {
                //название отредактированной статьи
                title: req.body.title,
                //текстовое содержимое отредактированной статьи
                text: req.body.text,   
                //изображение отредактированной статьи
                imageUrl: req.body.imageUrl,  
                //идентификатор пользователя, который отредактировал статью       
                user: req.userId,
                //тэги отредактированной статьи
                tags: req.body.tags
            }
        );

        res.json({
            success: true
        })
    }
    catch (err)
    {
        res.status(500).json({
            message: 'Failed to update the article'
        })
    }
}