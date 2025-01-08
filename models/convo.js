const { Sequelize, DataTypes } = require('sequelize');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';

const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

// Import User and Message models
const User = require('./user')(sequelize);
const Message = require('./message')(sequelize);

module.exports = (sequelize) => {
    const Convo = sequelize.define('Convo', {
        convo_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
              
        date_sent: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        timestamps: false,
    });

    Convo.associate = (models) => {
        Convo.hasMany(models.Message, {
            foreignKey: 'convo_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });

        
    };

    return Convo;
};