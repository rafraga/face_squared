'use strict';

module.exports = function (sequelize, DataTypes) {
  var Screenshot = sequelize.define('Screenshot', {
    info: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    streamTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    faceCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    videoTime: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  },
  {
    // Hooks are automatic methods that run during various phases of the User Model lifecycle
    // In this case, before a User is created, we will automatically hash their password
    hooks: {
    /*  beforeCreate: function (user, options, cb) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
        cb(null, options);
      }*/
    }
  });

  Screenshot.associate = function (models) {
    models.Screenshot.belongsTo(models.Video_Stream, {
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Screenshot;
};