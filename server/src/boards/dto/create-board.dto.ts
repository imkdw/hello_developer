export class CreateBoardDto {
  title: string;
  content: string;
  category: string;
  tags: {
    name: string;
  }[];
}
