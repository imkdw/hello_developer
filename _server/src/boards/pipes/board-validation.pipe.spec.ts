import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentMetadata } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { BoardValidationPipe } from './board-validation.pipe';
import { PipesModule } from './pipes.module';
import { CreateBoardDto } from '../dto/create-board.dto';
import { UpdateBoardDto } from '../dto/update-board.dto';

describe('[Pipe] AuthValidationPipe', () => {
  let pipe: BoardValidationPipe;
  let createBoardMetadata: ArgumentMetadata;
  let updateBoardMetadata: ArgumentMetadata;

  const title = '테스트 게시글의 제목입니다.';
  const category = 'qna-tech';
  const content = '테스트 게시글의 본문입니다.';
  const tags = [{ name: 'nestjs' }];

  createBoardMetadata = {
    type: 'body',
    metatype: CreateBoardDto,
    data: '',
  };

  updateBoardMetadata = {
    type: 'body',
    metatype: UpdateBoardDto,
    data: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PipesModule],
    }).compile();

    pipe = module.get<BoardValidationPipe>(BoardValidationPipe);
  });

  it('[글작성] 유효하지 않은 제목', async () => {
    const input = new CreateBoardDto();
    input.title = '';
    input.category = category;
    input.content = content;
    input.tags = tags;

    try {
      await pipe.transform(input, createBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_title');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글작성] 유효하지 않은 카테고리', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = 'none';
    input.content = content;
    input.tags = tags;

    try {
      await pipe.transform(input, createBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_category');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글작성] 유효하지 않은 본문', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = '';
    input.tags = tags;

    try {
      await pipe.transform(input, createBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_content');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글작성] 유효하지 않은 태그', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = content;
    input.tags = [{ name: 'noob' }, { name: 'noob' }, { name: 'noob' }, { name: 'noob' }];

    try {
      await pipe.transform(input, createBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_tags');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글작성] 올바른 데이터', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = content;
    input.tags = tags;

    const result = await pipe.transform(input, createBoardMetadata);
    expect(result).toEqual(input);
  });

  it('[글수정] 유효하지 않은 제목', async () => {
    const input = new CreateBoardDto();
    input.title = '';
    input.category = category;
    input.content = content;
    input.tags = tags;

    try {
      await pipe.transform(input, updateBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_title');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글수정] 유효하지 않은 카테고리', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = 'none';
    input.content = content;
    input.tags = tags;

    try {
      await pipe.transform(input, updateBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_category');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글수정] 유효하지 않은 본문', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = '';
    input.tags = tags;

    try {
      await pipe.transform(input, updateBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_content');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글수정] 유효하지 않은 태그', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = content;
    input.tags = [{ name: 'noob' }, { name: 'noob' }, { name: 'noob' }, { name: 'noob' }];

    try {
      await pipe.transform(input, updateBoardMetadata);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.message).toEqual('invalid_tags');
      expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
    }
  });

  it('[글수정] 올바른 데이터', async () => {
    const input = new CreateBoardDto();
    input.title = title;
    input.category = category;
    input.content = content;
    input.tags = tags;

    const result = await pipe.transform(input, updateBoardMetadata);
    expect(result).toEqual(input);
  });
});
