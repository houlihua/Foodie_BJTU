var User = require('./modules/past');
var Comment = require('./modules/comment');
var flash = require('connect-flash');
var Post = require('./modules/post');
var crypto = require('crypto');
module.exports=function(app){
app.get('/', function (req, res, next) {
  res.render('index',{
    title: 'Homepage',
    user: req.session.user,
    success:req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
app.get('/article', function (req, res) {
    res.render('article', { title: 'Article' });
  });
app.get('/reg', checkNotLogin);
app.get('/reg', function (req, res) {
  res.render('reg',{
    title: 'Register',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
 app.get('/xy', checkNotLogin);
 app.get('/xy', function (req, res) {
  res.render('xy',{
    title: 'Congratulations!',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
app.post('/reg', checkNotLogin);
app.post('/reg', function (req, res) {
  var userid = req.body.userid;
  var pwd = req.body.password;
  var pwd_re = req.body['password-repeat'];
  var email = req.body.email;
  if(pwd_re!= pwd) {
    req.flash('error','two password are not same!'); 
    return res.redirect('back');//返回注册页
  }
  var newUser = new User({
    userid: userid,
    password: pwd,
    email: email
  });
  newUser.save(function (err, user) {
     req.flash('success','Register successully!');
    //相关操作，写入session
    //res.send(user);
    req.session.user = user; 
    res.redirect('/');
  });
//登陆成功后跳转到主页
});
app.get('/login', checkNotLogin);
app.get('/login', function (req, res) {
    res.render('login', {
        title: 'Login',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()});
});
//app.post('/login', checkNotLogin);
app.post('/login', function (req, res) {
  //检查用户是否存在
  User.get(req.body.userid, function (err, user) {
    if (!user) {
      req.flash('error','this user is not exist!'); 
      return res.redirect('back');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != req.body.password) {
       req.flash('error','Wrong password!'); 
      return res.redirect('back');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    //res.send(user);
    req.session.user = user;
    req.flash('success','Login successfully');
    res.redirect('/');//登陆成功后跳转到主页
  });
});
app.get('/logout', checkLogin);
app.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', 'logout successfully!');
  res.redirect('/');  
});
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'login failure!'); 
    res.redirect('back');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'login twice!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}
app.get('/display', checkLogin);
app.get('/display', function (req, res) {
  //判断是否是第一页，并把请求的页数转换成 number 类型
  var page = parseInt(req.query.p) || 1;
  //查询并返回第 page 页的 10 篇文章
  Post.getTen(null, page, function (err, posts, total) {
    if (err) {
      posts = [];
    } 
    res.render('display', {
      title: 'My Article',
      posts: posts,
      page: page,
      isFirstPage: (page - 1) == 0,
      isLastPage: ((page - 1) * 10 + posts.length) == total,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
  app.get('/post', checkLogin);
  app.get('/post', function (req, res) {
    res.render('post', {
      title: 'Post',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
app.post('/post', checkLogin);
app.post('/post', function (req, res) {
  var currentUser = req.session.user,
    tags = [req.body.tag1, req.body.tag2, req.body.tag3],
    post = new Post(currentUser.userid, currentUser.head, tags,req.body.id,  req.body.restaurantid, req.body.disheslist, req.body.dishesnumber, req.body.seats);
  post.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/display');
    }
    req.flash('success', 'post successfully!');
    res.redirect('/display');//发表成功跳转到主页
  });
});
app.get('/upload', checkLogin);
app.get('/upload', function (req, res) {
  res.render('upload', {
    title: 'Upload',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
app.post('/upload', checkLogin);
app.post('/upload', function (req, res) {
  req.flash('success', 'upload successfully!');
  res.redirect('back');
});
app.get('/archive', function (req, res) {
  Post.getArchive(function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('archive', {
      title: 'Archive',
      orders: orders,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.get('/tags', function (req, res) {
  Post.getTags(function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('tags', {
      title: 'Tags:',
      orders: orders,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.get('/tags/:tag', function (req, res) {
  Post.getTag(req.params.tag, function (err, posts) {
    if (err) {
      req.flash('error',err); 
      return res.redirect('/');
    }
    res.render('tag', {
      title: 'TAG:' + req.params.tag,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.get('/links', function (req, res) {
  res.render('links', {
    title: 'Links',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});
app.get('/search', function (req, res) {
  Post.search(req.query.keyword, function (err, posts) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('/');
    }
    res.render('search', {
      title: "SEARCH:" + req.query.keyword,
      posts: posts,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.get('/u/:name', function (req, res) {
  var page = parseInt(req.query.p) || 1;
  //检查用户是否存在
  User.get(req.params.name, function (err, user) {
    if (!user) {
      req.flash('error', 'This user is not existing!'); 
      return res.redirect('back');
    }
    //查询并返回该用户第 page 页的 10 篇文章
    Post.getTen(user.name, page, function (err, posts, total) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      } 
      res.render('user', {
        title: user.name,
        posts: posts,
        page: page,
        isFirstPage: (page - 1) == 0,
        isLastPage: ((page - 1) * 10 + posts.length) == total,
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
      });
    });
  }); 
});
app.get('/u/:name/:day/:title', function (req, res) {
  Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    res.render('article', {
      title: req.params.title,
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.post('/u/:name/:day/:title', function (req, res) {
  var date = new Date(),
      time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
             date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
var md5 = crypto.createHash('md5'),
    email_MD5 = md5.update(req.body.email.toLowerCase()).digest('hex'),
    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48"; 
var comment = {
    name: req.body.name,
    head: head,
    email: req.body.email,
    website: req.body.website,
    time: time,
    content: req.body.content
};
  var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
  newComment.save(function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    req.flash('success', 'Message successfully!');
    res.redirect('back');
  });
});
app.get('/edit/:name/:day/:title', checkLogin);
app.get('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.edit(currentUser.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    res.render('edit', {
      title: 'Edit',
      post: post,
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
});
app.post('/edit/:name/:day/:title', checkLogin);
app.post('/edit/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.update(currentUser.name, req.params.day, req.params.title, req.body.post, function (err) {
    var url = encodeURI('/u/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
    if (err) {
      req.flash('error', err); 
      return res.redirect(url);//出错！返回文章页
    }
    req.flash('success', 'update successfully!');
    res.redirect(url);//成功！返回文章页
  });
});
app.get('/remove/:name/:day/:title', checkLogin);
app.get('/remove/:name/:day/:title', function (req, res) {
  var currentUser = req.session.user;
  Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    req.flash('success', 'Delete successfully!');
    res.redirect('/display');
  });
});
app.get('/reprint/:name/:day/:title', checkLogin);
app.get('/reprint/:name/:day/:title', function (req, res) {
  Post.edit(req.params.name, req.params.day, req.params.title, function (err, post) {
    if (err) {
      req.flash('error', err); 
      return res.redirect('back');
    }
    var currentUser = req.session.user,
        reprint_from = {name: post.name, day: post.time.day, title: post.title},
        reprint_to = {name: currentUser.name, head: currentUser.head};
    Post.reprint(reprint_from, reprint_to, function (err, post) {
      if (err) {
        req.flash('error', err); 
        return res.redirect('back');
      }
      req.flash('success', 'Reprint successfully!');
      //var url = encodeURI('/u/' + post.name + '/' + post.time.day + '/' + post.title);
      //跳转到转载后的文章页面
      res.redirect('/archive');
    });
  });
});
};
