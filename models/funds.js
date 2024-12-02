const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const connectionString = 'postgresql://postgres.wktdygngpenuvshfxnam:@CoopM0B1L3--@aws-0-ap-southeast-1.pooler.supabase.com/postgres';
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    logging: console.log,
});

const FundModel = (sequelize) => {
    const Fund = sequelize.define ('Fund', {

        fund_id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            unique:true,
        },
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Application,  
                key: 'application_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        loan_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Loan,
                key: 'loan_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        cbu_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Cbu,  
                key: 'cbu_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        savings_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: Savings,  
                key: 'savings_id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        type: {
            type: DataTypes.ENUM ('cbu', 'savings', 'loan_rev', 'service_charge',),
            allownull: false,
        }

    })
}