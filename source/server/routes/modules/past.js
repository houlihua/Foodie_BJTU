var mongodb = require('./db');

function User(user) {
  this.userid = user.userid;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;
User.prototype.save = function (callback) {
var user = {
      userid: this.userid,
      password: this.password,
      email: this.email
};
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      console.log("error1!");
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        console.log("error2!");
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将用户数据插入 users 集合
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        console.log("store!");
        mongodb.close();
        if (err) {
          console.log("error3!");
          return callback(err);//错误，返回 err 信息
        }
        callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
      });
    });
  });
};
//读取用户信息
User.get = function(userid, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 users 集合
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
    });
  });
};
