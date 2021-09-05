import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from '../products/product/product.entity';
import { UserEntity } from '../user/user.entity';

@Entity({ name: 'comment' })
export class CommentEntity {
  @PrimaryGeneratedColumn()
  idComment: number;

  @Column({ nullable: false })
  comment: string;

  @ManyToOne((type) => UserEntity, (user) => user.idUser, {
    eager: false,
  })
  user: UserEntity;

  @ManyToOne((type) => ProductEntity, (product) => product.idProduct, {
    eager: false,
  })
  product: ProductEntity;

  constructor(comment: string, user: UserEntity, product: ProductEntity) {
    this.comment = comment;
    this.user = user;
    this.product = product;
  }
}
