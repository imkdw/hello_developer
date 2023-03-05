import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrations1677998731562 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO boards_category (id, name) VALUES
        (1, 'notice'),
        (2, 'suggestion'),
        (3, 'free'),
        (4, 'knowledge'),
        (5, 'tips'),
        (6, 'review'),
        (7, 'qna'),
        (8, 'tech'),
        (9, 'career'),
        (10, 'recruitment'),
        (11, 'project'),
        (12, 'study'),
        (13, 'company');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
