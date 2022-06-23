import PostModel from '../models/post.js'

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        
        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью'
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        // так и не понял зачем это, что-то для связи с юзером....

        res.json(posts)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;
        PostModel.findOneAndUpdate({
            _id: postId,
        }, {$inc: {viewsCount: 1}}, {returnDocument: 'after'}, (err, doc) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось получить статью'
                });
                // ретюрн для того чтобы код ниже не выполнялся
            };

            if(!doc){
                return res.status(404).json({   
                    message: 'Статья не найдена'
                })
            };

            res.json(doc);
        })
        // тут 4 параметра. Так как после получения конкретной статьи мы хотим обновить ее кол-во просмотров
        // мы должны получить статью и обновить ее, в параметры передаем настройки обновления
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьююю'
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        PostModel.findOneAndDelete({
            _id: postId,
        }, (err, doc) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: 'Не удалось удалить статью'
                }); 
            };

            if(!doc){
                console.log(err);
                return res.status(404).json({
                    message: 'Статья не найдена'
                });  
            };

            res.json({
                success: true
            })
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
};  

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
            tags: req.body.tags,
        },
        );
        res.json({
            success: true
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью'
        });
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

        res.json(tags)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
}