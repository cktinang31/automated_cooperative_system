const { Sequelize, DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

module.exports = (sequelize) => {
    const Message = sequelize.define('Message', {
        message_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        convo_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        receiver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        sender_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'user_id',
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Convo, {
            foreignKey: 'convo_id',
            onDelete: 'CASCADE',
        });
        Message.belongsTo(models.User, { as: 'receiver', foreignKey: 'receiver_id' });
        Message.belongsTo(models.User, { as: 'sender', foreignKey: 'sender_id' });
    };

    return Message;
};


