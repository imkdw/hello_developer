import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BoardEntity } from '../board/board.entity';

@Entity('BoardView')
export class BoardViewEntity {
  @PrimaryGeneratedColumn({ name: 'view_id' })
  viewId: number;

  @Column({ type: 'int', nullable: true, default: 0 })
  viewCnt: number;

  @Column({ type: 'varchar', length: 36, name: 'board_id' })
  boardId: string;

  @OneToOne(() => BoardEntity, (board) => board.boardId)
  @JoinColumn({ name: 'board_id' })
  board: BoardEntity;
}
