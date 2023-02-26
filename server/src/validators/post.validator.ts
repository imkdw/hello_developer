import { NextFunction, Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

import { AddPostUserDTO } from "../types/post";

export class PostValidator {
  /**
   * 게시글 추가시 userDTO를 검증하는 로직
   */
  static add: RequestHandler<ParamsDictionary, any, AddPostUserDTO, ParsedQs> = (req, res, next: NextFunction) => {
    const userDTO: AddPostUserDTO = req.body;

    try {
      const { title, content, category, tags } = userDTO;

      /**
       * 제목 유효성 검증
       * 1. 제목은 1~50자로 설정 필요
       */
      if (title.length === 0 || title.length >= 50) {
        const err = Object.assign(new Error(), {
          status: 400,
          message: "Bad Reqeust",
          description: "The title of the post must be at least 1 to 50 digits.",
          data: {
            action: "post",
            parameter: title,
            message: "invalid_title",
          },
        });
        next(err);
      }

      /**
       * 본문 내용 유효성 검증
       * 1. 본문의 내용은 1 ~ 100,000자 사이의 내용으로 구성되야함
       */
      if (content.length === 0 || content.length >= 100000) {
        const err = Object.assign(new Error(), {
          status: 400,
          message: "Bad Reqeust",
          description: "The content of the post must be at least 10 digits to 100000 digits.",
          data: {
            action: "post",
            parameter: content,
            message: "invalid_content",
          },
        });
        next(err);
      }

      /**
       * category 유효성 검증
       * 1. 카테고리가 none으로 입력되지 않아야함
       */
      if (category === "none") {
        const err = Object.assign(new Error(), {
          status: 400,
          message: "Bad Reqeust",
          description: "The category of the post must not be none",
          data: {
            action: "post",
            parameter: content,
            message: "invalid_category",
          },
        });
        next(err);
      }

      /**
       * tags 유효성 검증
       * 1. 각 태그의 name의 길이는 10자로 제한
       */
      tags.forEach((tag) => {
        if (tag.name.length >= 11) {
          const err = Object.assign(new Error(), {
            status: 400,
            message: "Bad Reqeust",
            description: "The name of the post tag can be up to 10 digits.",
            data: {
              action: "post",
              parameter: tags,
              message: "invalid_tags",
            },
          });
          next(err);
        }
      });

      next();
    } catch (err: any) {
      throw err;
    }
  };

  static addComment = (req: Request, res: Response, next: NextFunction) => {
    const { comment } = req.body;
  };
}
