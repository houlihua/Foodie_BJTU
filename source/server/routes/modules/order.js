var mongodb = require('./db');
var markdown = require('markdown').markdown;
function Order(userid, id, tags, restaurantid, disheslist, dishesnumber, seats) {
  this.userid = userid;
  this.id = id;
  this.tags = tags;
  this.restaurantid = restaurantid;
  this.disheslist = disheslist;
  this.dishesnumber = dishesnumber;
  this.seats = seats;
  this.phonenumber = phonenumber;
}

module.exports = Order;

//�洢һ���˵����������Ϣ
Post.prototype.save = function(callback) {
  var date = new Date();
  //�洢����ʱ���ʽ�������Ժ���չ
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
  }
  //Ҫ�������ݿ���ĵ�
  var order = {
      userid: this.userid,
      id: this.id,
      restaurantid: this.restaurantid,
      disheslist: this.disheslist,
      dishesnumber: this.dishesnumber,      
      phonenumber: this.phonenumber,
      time: time,
      tags: this.tags,
      seats: this.seats,
      reprint_info: {},
      comments: [],
      pv: 0
  };
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ orders ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //���ĵ����� orders ����
      collection.insert(order, {
        safe: true
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);//ʧ�ܣ����� err
        }
        callback(null);//���� err Ϊ null
      });
    });
  });
};
//�͹�����ͻ��Ķ�����ÿҳʮ��
Post.getTen = function(restaurantid, page, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ posts ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var query = {};
      if (resterrauntid) {
        query.restaurantid = restaurantid;
      }
      //ʹ�� count �����ض���ѯ���ĵ��� total
      collection.count(query, function (err, total) {
        //���� query �����ѯ��������ǰ (page-1)*10 �����������֮��� 10 �����
        collection.find(query, {
          skip: (page - 1)*10,
          limit: 10
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          //���� markdown Ϊ html
          docs.forEach(function (doc) {
            doc.post = markdown.toHTML(doc.post);
          });  
          callback(null, docs, total);
        });
      });
    });
  });
};
//�͹ݻ�ȡһ���˵�
Post.getOne = function(restaurantid, day, id, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ orders ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //�����û������������ڼ��������в�ѯ
      collection.findOne({
        "retaurantid": userid,
        "time.day": day,
        "id": id
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        if (doc) {
          //ÿ���� 1 �Σ�pv ֵ���� 1
          collection.update({
            "name": name,
            "time.day": day,
            "title": title
          }, {
            $inc: {"pv": 1}
          }, function (err) {
            mongodb.close();
            if (err) {
              return callback(err);
            }
          });
          //���� markdown Ϊ html
          doc.post = markdown.toHTML(doc.post);
          doc.comments.forEach(function (comment) {
            comment.content = markdown.toHTML(comment.content);
          });
          callback(null, doc);//���ز�ѯ��һ���˵�
        }
      });
    });
  });
};
//����ԭʼ��������ݣ�markdown ��ʽ��

//�ͻ��Զ������ݽ����޸�
Post.edit = function(userid, day, id, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ posts ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //�����û������������ڼ����������в�ѯ
      collection.findOne({
        "userid": userid,
        "time.day": day,
        "id": id
      }, function (err, doc) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, doc);//���ز�ѯ��һ���˵���markdown ��ʽ��
      });
    });
  });
};
//����һ���˵����������Ϣ
Post.update = function(userid, day, id, seats, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ orders ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //������������
      collection.update({
        "userid": userid,
        "time.day": day,
        "id": id
      }, {
        $set: {seats: seats}
      }, function (err) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null);
      });
    });
  });
};
/�ͻ�ɾ��һ������
Post.remove = function(userid, day, id, callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ orders ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //��ѯҪɾ�����ĵ�
      collection.findOne({
        "uerid": userid,
        "time.day": day,
        "id": id
      }, function (err, doc) {
        if (err) {
          mongodb.close();
          return callback(err);
        }
        //����� reprint_from������������ת�����ģ��ȱ������� reprint_from
        var reprint_from = "";
        if (doc.reprint_info.reprint_from) {
          reprint_from = doc.reprint_info.reprint_from;
        }
        if (reprint_from != "") {
          //����ԭ���������ĵ��� reprint_to
          collection.update({
            "name": reprint_from.name,
            "time.day": reprint_from.day,
            "title": reprint_from.title
          }, {
            $pull: {
              "reprint_info.reprint_to": {
                "name": name,
                "day": day,
                "title": title
            }}
          }, function (err) {
            if (err) {
              mongodb.close();
              return callback(err);
            }
          });
        }

        //ɾ��ת�����Ĳ˵�
        collection.remove({
          "userid": userid,
          "time.day": day,
          "id": id
        }, {
          w: 1
        }, function (err) {
          mongodb.close();
          if (err) {
            return callback(err);
          }
          callback(null);
        });
      });
    });
  });
};
//�������в˵���Ϣ
Post.getArchive = function(callback) {
  //�����ݿ�
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //��ȡ posts ����
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //����ֻ���� userid��time��id ���Ե��ĵ���ɵĴ浵����
      collection.find({}, {
        "userid": 1,
        "time": 1,
        "id": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};
//�������б�ǩ
Post.getTags = function(callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //distinct �����ҳ������������в�ֵͬ
      collection.distinct("tags", function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};
//���غ����ض���ǩ�����в�Ʒ
Post.getTag = function(tag, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //��ѯ���� tags �����ڰ��� tag ���ĵ�
      //������ֻ���� name��time��title ��ɵ�����
      collection.find({
        "tags": tag
      }, {
        "name": 1,
        "time": 1,
        "title": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};
//����ͨ������ؼ��ֲ�ѯ�����в�Ʒ��Ϣ
Post.search = function(keyword, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      var pattern = new RegExp(keyword, "i");
      collection.find({
        "id": pattern
      }, {
        "userid": 1,
        "time": 1,
        "id": 1
      }).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
         return callback(err);
        }
        callback(null, docs);
      });
    });
  });
};
