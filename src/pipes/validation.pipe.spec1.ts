// import { Test, TestingModule } from '@nestjs/testing';
// import { Type, ArgumentMetadata } from '@nestjs/common';
// import { BadRequestException } from '@nestjs/common/exceptions';
// import { HttpStatus } from '@nestjs/common/enums';
// import { ValidationPipe } from './validation.pipe';
// import { PipesModule } from './pipes.module';
// import { RegisterDto } from 'src/auth/dto/register.dto';
// import { LoginDto } from 'src/auth/dto/login.dto';
// import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
// import { UpdateBoardDto } from 'src/boards/dto/update-board.dto';
// import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';

// describe('[Pipe] ValidationPipe', () => {
//   let pipe: ValidationPipe;
//   let registerMetadata: ArgumentMetadata;
//   let loginMetadata: ArgumentMetadata;
//   let createBoardMetadata: ArgumentMetadata;
//   let updateBoardMetadata: ArgumentMetadata;
//   let createCommentMetaData: ArgumentMetadata;

//   const email = 'test@test.com';
//   const password = 'asdf1234!@';
//   const nickname = 'testuser';

//   registerMetadata = {
//     type: 'body',
//     metatype: RegisterDto,
//     data: '',
//   };

//   loginMetadata = {
//     type: 'body',
//     metatype: LoginDto,
//     data: '',
//   };

//   createBoardMetadata = {
//     type: 'body',
//     metatype: CreateBoardDto,
//     data: '',
//   };

//   updateBoardMetadata = {
//     type: 'body',
//     metatype: UpdateBoardDto,
//     data: '',
//   };

//   createCommentMetaData = {
//     type: 'body',
//     metatype: CreateCommentDto,
//     data: '',
//   };

//   const title = '테스트 게시글의 제목입니다.';
//   const category = 'qna-tech';
//   const content = '테스트 게시글의 본문입니다.';
//   const tags = [{ name: 'nestjs' }];

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [PipesModule],
//     }).compile();

//     pipe = module.get<ValidationPipe>(ValidationPipe);
//   });

//   describe('[Auth] AuthController 유효성 검증', () => {
//     it('[회원가입] 유효하지 않은 이메일', async () => {
//       const input = new RegisterDto();
//       input.email = 'imkdw';
//       input.password = password;
//       input.nickname = nickname;

//       try {
//         await pipe.transform(input, registerMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_email');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[회원가입] 유효하지 않은 비밀번호', async () => {
//       const input = new RegisterDto();
//       input.email = email;
//       input.password = 'asdf1234';
//       input.nickname = nickname;

//       try {
//         await pipe.transform(input, registerMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_password');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[회원가입] 유효하지 않은 닉네임', async () => {
//       const input = new RegisterDto();
//       input.email = email;
//       input.password = password;
//       input.nickname = 'testuse!';

//       try {
//         await pipe.transform(input, registerMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_nickname');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[회원가입] 올바른 데이터', async () => {
//       const input = new RegisterDto();
//       input.email = email;
//       input.password = password;
//       input.nickname = nickname;

//       const result = await pipe.transform(input, registerMetadata);
//       expect(result).toEqual(input);
//     });
//   });

//   describe('[Board] BoardsController 유효성 검증', () => {
//     it('[글작성] 유효하지 않은 제목', async () => {
//       const input = new CreateBoardDto();
//       input.title = '';
//       input.category = category;
//       input.content = content;
//       input.tags = tags;

//       try {
//         await pipe.transform(input, createBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_title');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글작성] 유효하지 않은 카테고리', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = 'none';
//       input.content = content;
//       input.tags = tags;

//       try {
//         await pipe.transform(input, createBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_category');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글작성] 유효하지 않은 본문', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = '';
//       input.tags = tags;

//       try {
//         await pipe.transform(input, createBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_content');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글작성] 유효하지 않은 태그', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = content;
//       input.tags = [{ name: 'noob' }, { name: 'noob' }, { name: 'noob' }, { name: 'noob' }];

//       try {
//         await pipe.transform(input, createBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_tags');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글작성] 올바른 내용', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = content;
//       input.tags = tags;

//       const result = await pipe.transform(input, createBoardMetadata);
//       expect(result).toEqual(input);
//     });

//     it('[글수정] 유효하지 않은 제목', async () => {
//       const input = new CreateBoardDto();
//       input.title = '';
//       input.category = category;
//       input.content = content;
//       input.tags = tags;

//       try {
//         await pipe.transform(input, updateBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_title');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글수정] 유효하지 않은 카테고리', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = 'none';
//       input.content = content;
//       input.tags = tags;

//       try {
//         await pipe.transform(input, updateBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_category');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글수정] 유효하지 않은 본문', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = '';
//       input.tags = tags;

//       try {
//         await pipe.transform(input, updateBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_content');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글수정] 유효하지 않은 태그', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = content;
//       input.tags = [{ name: 'noob' }, { name: 'noob' }, { name: 'noob' }, { name: 'noob' }];

//       try {
//         await pipe.transform(input, updateBoardMetadata);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_tags');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[글수정] 올바른 내용', async () => {
//       const input = new CreateBoardDto();
//       input.title = title;
//       input.category = category;
//       input.content = content;
//       input.tags = tags;

//       const result = await pipe.transform(input, updateBoardMetadata);
//       expect(result).toEqual(input);
//     });
//   });

//   describe('[Comment] CommentsController 유효성 검증', () => {
//     it('[댓글작성] 유효하지 않은 댓글 내용', async () => {
//       const input = new CreateCommentDto();
//       input.boardId = 'board-id-1';
//       input.comment = '';

//       try {
//         await pipe.transform(input, createCommentMetaData);
//       } catch (error) {
//         expect(error).toBeInstanceOf(BadRequestException);
//         expect(error.message).toEqual('invalid_comment');
//         expect(error.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
//       }
//     });

//     it('[댓글작성] 올바른 내용', async () => {
//       const input = new CreateCommentDto();
//       input.boardId = 'board-id-1';
//       input.comment = 'test';

//       const result = await pipe.transform(input, createCommentMetaData);
//       expect(result).toEqual(input);
//     });
//   });
// });
