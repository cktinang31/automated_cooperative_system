const {Pool,Client} = require ('pg')
const connectionString = 'postgressql://postgres:Ctugk3nd3s@localhost:5432/Cooperativedb'
const { Sequelize, DataTypes } = require('sequelize');


const pool = new Pool({
    connectionString:connectionString
})

pool.connect()

.then(() => {
    console.log('Connected to PostgreSQL database');
   
 })

.catch(err => console.error('Error connecting to PostgreSQL database', err));




const sequelize = new Sequelize('Cooperativedb', 'postgres', 'Ctugk3nd3s', {
    host: 'localhost',
    dialect: 'postgres',
  });


//application table

const Application = sequelize.define('Application', {
    application_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    fname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    mname: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    lname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    place_of_birth: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{timestamps: false,});

(async () => {
      try {
        await sequelize.sync();
        console.log('Database synchronized');
      } catch (error) {
        console.error('Error synchronizing database:', error);
      }
    })();

module.exports = Application;
