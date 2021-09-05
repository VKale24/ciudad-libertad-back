import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/modules/products/product/repositories/product.repository';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { CommentEntity } from '../comments.entity';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getCommentsByProduct(idProduct: number) {
    const product = await this.productRepository.findOne(idProduct);

    if (!product) throw new NotFoundException();

    const comments = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.product', 'product')
      .where('comment.product.idProduct = :idProduct', {
        idProduct: product.idProduct,
      })
      .getMany();

    return comments;
  }

  async createCommentToProduct(
    comment: string,
    userDto: UserDto,
    idProduct: number,
  ) {
    const product = await this.productRepository.findOne(idProduct);

    if (!product) throw new NotFoundException();

    const user = await this.userRepository.findOne({
      where: { username: userDto.username },
    });

    if (!user) throw new NotFoundException();

    const newComment = new CommentEntity(comment, user, product);

    await this.commentRepository.save(newComment);

    return newComment;
  }
}
