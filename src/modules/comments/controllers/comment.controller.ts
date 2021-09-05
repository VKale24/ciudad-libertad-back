import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { CommentService } from '../services/comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly _commentService: CommentService) {}

  @Get()
  async getCommentsByProduct(
    @Body('idProduct', ParseIntPipe) idProduct: number,
  ) {
    return await this._commentService.getCommentsByProduct(idProduct);
  }

  @Post()
  @UseGuards(AuthGuard())
  async addCommentToProduct(
    @Body('idProduct') idProduct: number,
    @GetUser()
    user: UserDto,
    @Body('comment') comment: string,
  ) {
    return await this._commentService.createCommentToProduct(comment, user, idProduct);
  }
}
