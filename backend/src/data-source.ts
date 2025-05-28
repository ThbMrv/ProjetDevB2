import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import 'dotenv/config'; // ⬅️ ajoute cette ligne si elle n'y est pas


export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // ✅ migrations only
  logging: true,
  entities: [User],
  migrations: ['dist/src/migrations/*.js'], // chemins après build
});
