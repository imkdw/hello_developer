import { Board } from '../boards/board.entity';
import { Category } from '../boards/category/category.entity';
import { Recommend } from '../boards/recommend/recommend.entity';
import { Tag } from '../boards/tag/tag.entity';
import { Comment } from '../comments/comment.entity';
import { User } from '../users/user.entity';
import { View } from 'typeorm/schema-builder/view/View';

export default () => ({
  database: {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    entities: [User, Board, Category, Recommend, Tag, View, Comment],
    synchronize: true,
    dropSchema: true,
  },
});
