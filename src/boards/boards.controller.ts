import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  HttpCode,
  Patch,
  Body,
  Query,
} from '@nestjs/common';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { ValidationPipe } from '../pipes/validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadDto } from './dto/image-upload.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist';

@Controller('boards')
@ApiTags('게시글 API')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  /**
   * [POST] /boards - 게시글 생성 API
   * @param req
   * @param createBoardDto - 게시글 생성시 입력되는 데이터
   * @returns
   */
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  @ApiOperation({ summary: '게시글 생성 API' })
  @ApiCreatedResponse({
    description: '새로운 게시글을 생성하고, 생성된 게시글의 ID를 반환',
    schema: {
      type: 'object',
      properties: {
        boardId: { type: 'string' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: `
    게시글 제목이 올바르지 않을경우 - invalid_title
    게시글 내용이 올바르지 않을경우 - invalid_content
    게시글 카테고리가 올바르지 않을경우 - invalid_category
    게시글 태그가 올바르지 않는경우 - invalid_tags`,
    schema: {
      type: 'object',
      properties: {
        statusCode: { example: 400 },
        message: {
          example: 'invalid_title, invalid_content, invalid_category, invalid_tags',
        },
      },
    },
  })
  async create(@Req() req, @Body() createBoardDto: CreateBoardDto) {
    const boardId = await this.boardsService.create(req.user.userId, createBoardDto);
    return { boardId };
  }

  /**
   * [GET] /boards?category1=&category2= - 특정 카테고리의 게시글을 모두 조회하는 API
   * @param category1 - 첫번째 카테고리
   * @param category2 - 두번째 카테고리
   * @returns
   */
  @ApiOperation({ summary: '특정 카테고리 게시글 조회 API' })
  @ApiOkResponse({
    description: '게시글 목록 반환',
    schema: {
      properties: {
        boardId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string' },
        user: {
          properties: {
            userId: { type: 'string' },
            nickname: { type: 'string' },
            profileImg: { type: 'string' },
          },
        },
        view: {
          properties: {
            viewCnt: { type: 'number' },
          },
        },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
            },
          },
        },
        category2: {
          properties: {
            name: { type: 'string' },
          },
        },
      },
    },
  })
  @Get()
  async findAll(@Query('category1') category1: string, @Query('category2') category2: string) {
    const boards = await this.boardsService.findAll(category1, category2);
    return boards;
  }

  /**
   * [GET] /boards/recent - 메인페이지에 표시되는 최근게시글을 가져오는 API
   * @returns
   */
  @ApiOperation({ summary: '최근 게시글 조회 API' })
  @ApiOkResponse({
    description: '최근 게시글 목록 반환',
    schema: {
      properties: {
        notice: {
          type: 'array',
          example: [
            {
              boardId: 'string',
              title: 'string',
              createdAt: 'string',
              user: { nickname: 'string', profileImg: 'string' },
              view: { viewCnt: 0 },
            },
          ],
        },
        qna: { type: 'array', example: [] },
        knowledge: { type: 'array', example: [] },
        recruitment: { type: 'array', example: [] },
      },
    },
  })
  @Get('recent')
  async recent() {
    const recentBoards = await this.boardsService.recent();
    return { ...recentBoards };
  }

  /**
   * [GET] /boards/search?text= - 게시글을 검색할때 사용하는 API
   * @param text - 검색어
   * @returns
   */
  @ApiOperation({ summary: '게시글 검색 API' })
  @ApiOkResponse({
    description: '검색결과 게시글 목록 반환',
    schema: {
      type: 'array',
      example: [
        {
          boardId: 'string',
          title: 'string',
          content: 'string',
          createdAt: 'string',
          user: { userId: 'string', nickname: 'string', profileImg: 'string' },
          view: { viewCnt: 0 },
          tags: [{ name: 'string' }],
          category2: { name: 'string' },
        },
      ],
    },
  })
  @Get('search')
  async search(@Query('text') text: string) {
    const result = await this.boardsService.search(text);
    return result;
  }

  /**
   * [GET] /boards/:boardId - 게시글을 상세정보 조회 API
   * @param boardId - 게시글 아이디
   * @returns
   */
  @ApiOperation({ summary: '특정 게시글 조회 API' })
  @ApiOkResponse({
    description: '게시글 조회 성공시 객체 형식의 상세보기 데이터를 반환',
    schema: {
      properties: {
        boardId: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string' },
        recommendCnt: { type: 'number' },
        user: {
          properties: {
            userId: { type: 'string' },
            nickname: { type: 'string' },
            profileImg: { type: 'string' },
          },
        },
        comments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              commentId: { type: 'number' },
              comment: { type: 'string' },
              createdAt: { type: 'string' },
              user: {
                properties: {
                  userId: { type: 'string' },
                  nickname: { type: 'string' },
                  profileImg: { type: 'string' },
                },
              },
            },
          },
        },
        view: {
          properties: {
            viewCnt: { type: 'number' },
          },
        },
        tags: {
          type: 'array',
          items: { type: 'object', properties: { name: { type: 'string' } } },
        },
        category1: { properties: { name: { type: 'string' } } },
        category2: { properties: { name: { type: 'string' } } },
        recommends: {
          type: 'array',
          items: { type: 'object', properties: { userId: { type: 'string' } } },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '게시글을 찾을수 없는경우 HTTP 404 - board_not_found',
    schema: {
      properties: {
        statusCode: {
          example: 404,
        },
        message: {
          example: 'board_not_found',
        },
      },
    },
  })
  @Get(':boardId')
  async detail(@Param('boardId') boardId: string) {
    const board = await this.boardsService.detail(boardId);
    return board;
  }

  /**
   * [DELETE] /boards/:boardId - 게시글 삭제 API
   * @param req
   * @param boardId - 게시글 아이디
   */
  @ApiOperation({ summary: '게시글 삭제 API' })
  @ApiUnauthorizedResponse({
    description:
      '삭제를 요청한 유저와 실제 게시글의 유저가 일치하지 않는경우 HTTP 401 - unauthorized_user 반환',
    schema: {
      properties: {
        statusCode: {
          example: 401,
        },
        message: {
          example: 'unauthorized_user',
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '삭제를 요청한 게시글을 찾을 수 없는경우 HTTP 404 - board_not_found 반환',
    schema: {
      properties: {
        statusCode: {
          example: 404,
        },
        message: {
          example: 'board_not_found',
        },
      },
    },
  })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':boardId')
  async remove(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.remove(req.user.userId, boardId);
  }

  /**
   * [PATCH] /boards/:boardId - 게시글 수정 API
   * @param req
   * @param boardId - 게시글 아이디
   * @param updateBoardDto - 게시글 수정 데이터
   */
  @ApiOperation({ summary: '게시글 수정 API' })
  @ApiNoContentResponse({
    description: '수정에 성공하는 경우 HTTP 204 반환',
  })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Patch(':boardId')
  async update(
    @Req() req,
    @Param('boardId') boardId: string,
    @Body(ValidationPipe) updateBoardDto: UpdateBoardDto,
  ) {
    await this.boardsService.update(req.user.userId, updateBoardDto, boardId);
  }

  /**
   * [GET] /boards/:boardId/recommend - 게시글 추천 추가/삭제 API
   * @param req
   * @param boardId - 추천을 요청한 게시글 아이디
   */
  @ApiOperation({
    summary: '게시글 추천 API',
    description: `
    특정 게시글을 추천/추천취소 하는 API\n
    추천 성공 : HTTP 200 반환
  `,
  })
  @ApiOkResponse({
    description: '게시글 추천 추가/삭제 성공시 HTTP 200 반환',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:boardId/recommend')
  async recommend(@Req() req, @Param('boardId') boardId: string) {
    await this.boardsService.recommend(req.user.userId, boardId);
  }

  /**
   * [GET] /boards/:boardId/views - 게시글 조회수 API
   * @param boardId - 조회한 게시글의 아이디
   */
  @ApiOperation({ summary: '게시글 조회수 API' })
  @ApiOkResponse({
    description: '게시글 조회수 증가 성공시 HTTP 200 반환',
  })
  @Get(':boardId/views')
  async views(@Param('boardId') boardId: string) {
    await this.boardsService.views(boardId);
  }

  /**
   * [POST] /boards/image - 게시글 작성/수정시 이미지 업로드 API
   * @param file - 업로드한 이미지 파일
   * @param imageUploadDto - 사진 업로드시 포함된 게시글 아이디
   * @returns 업로드된 이미지의 URL 반환
   */
  @ApiOperation({ summary: '게시글 작성/수정시 이미지 업로드 API' })
  @ApiOkResponse({
    description: '이미지 업로드에 성공하면 imageUrl 반환',
    schema: {
      properties: {
        imageUrl: {
          type: 'string',
        },
      },
    },
  })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  async imageUpload(
    @UploadedFile() file: Express.Multer.File,
    @Body() imageUploadDto: ImageUploadDto,
  ) {
    const imageUrl = await this.boardsService.imageUpload(file, imageUploadDto);
    return imageUrl;
  }
}
