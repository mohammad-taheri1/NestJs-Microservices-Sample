import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { createOrUpdateProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Get()
  async all() {
    // const payload = {
    //   message: 'This is a new notification',
    //   sent_at: new Date(),
    // };
    // this.client.emit('hello', payload);
    return await this.productService.all();
  }

  @Post()
  async create(@Body() body: createOrUpdateProductDto) {
    const product = await this.productService.create(body);
    this.client.emit('product_created', product);
    return product;
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.get(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: createOrUpdateProductDto,
  ) {
    await this.productService.update(id, body);
    const product = await  this.productService.get(id);
    this.client.emit('product_updated', product);
    return product;
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    await this.productService.delete(id);
    this.client.emit('product_deleted', id);
  }

  @Post(':id/like')
  async like(@Param('id') id: number){
    const product = await this.productService.get(id);

    return await this.productService.update(id, {
      likes: product.likes + 1
    });
  }
}
