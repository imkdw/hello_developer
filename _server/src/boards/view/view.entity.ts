import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Board } from '../board.entity';

@Entity('View')
export class View {
  @PrimaryGeneratedColumn({ name: 'view_id' })
  viewId: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  viewCnt: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @OneToOne(() => Board, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
