import { Injectable } from '@nestjs/common';
import { CreateNewsCategoryDto } from './dto/create-news-category.dto';
import { UpdateNewsCategoryDto } from './dto/update-news-category.dto';

@Injectable()
export class NewsCategoryService {
  create(createNewsCategoryDto: CreateNewsCategoryDto) {
    return 'This action adds a new newsCategory';
  }

  findAll() {
    return `This action returns all newsCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsCategory`;
  }

  update(id: number, updateNewsCategoryDto: UpdateNewsCategoryDto) {
    return `This action updates a #${id} newsCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsCategory`;
  }
}
