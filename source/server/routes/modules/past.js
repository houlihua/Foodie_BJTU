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
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      console.log("error1!");
      return callback(err);//���󣬷��� err ��Ϣ
    }
    //��ȡ users ����
    db.collection('users', function (err, collection) {
      if (err) {
        console.log("error2!");
        mongodb.close();
        return callback(err);//���󣬷��� err ��Ϣ
      }
      //���û����ݲ��� users ����
      collection.insert(user, {
        safe: true
      }, function (err, user) {
        console.log("store!");
        mongodb.close();
        if (err) {
          console.log("error3!");
          return callback(err);//���󣬷��� err ��Ϣ
        }
        callback(null, user[0]);//�ɹ���err Ϊ null�������ش洢����û��ĵ�
      });
    });
  });
};
//��ȡ�û���Ϣ
User.get = function(userid, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//���󣬷��� err ��Ϣ
    }
    //��ȡ users ����
    db.collection('users', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//���󣬷��� err ��Ϣ
      }
      //�����û�����name����ֵΪ name һ���ĵ�
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//ʧ�ܣ����� err ��Ϣ
        }
        callback(null, user);//�ɹ������ز�ѯ���û���Ϣ
      });
    });
  });
};
