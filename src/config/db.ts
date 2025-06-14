import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();
const DB_NAME = process.env.DB_NAME as string;
const DB_HOST = process.env.DB_HOST as string;
const DB_PASSWORD = process.env.DB_PASSWORD as string;
const DB_USER = process.env.DB_USER || '' as string;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    define: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    timezone: '-00:00',
    dialectOptions: {
        timezone: 'Z',
        dateStrings: true
    },
    logging: false
});

export const startOfDatabase = async () => {
    sequelize
        .sync({})
        .then(() => {
            console.log('Database and tables have been synchronized');
        })
        .catch((err) => {
            console.error('An error occurred while synchronizing the database:', err);
        });
};
