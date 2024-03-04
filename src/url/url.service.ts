import { BadRequestException, Injectable } from '@nestjs/common';
import { Url, UrlDocument } from './model/url.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async shorten(dto: CreateUrlDto): Promise<string> {
    const origin = `${process.env.BASE_URL}:${process.env.PORT}`
    const url = await this.urlModel.findOne({ url: dto.url })
    if (url?.code) 
      return `${origin}/${url.code}`

    dto.code = this.generateHash()
    const newUrl = await this.create(dto)
    return `${origin}/${newUrl.code}`
  }

  async create(dto: CreateUrlDto): Promise<Url> {
    const newUrl = new this.urlModel(dto)
    return await newUrl.save()
  }

  async getAllUrls(){
    return await this.urlModel.find({})
  }

  async findByCode(code: string): Promise<string> {
    const data = await this.urlModel.findOne({ code })
    if (!data)
      throw new BadRequestException('incorrect code')

    return data.url
  }

  // nanoid
  private generateHash(lenght: number = 10){
    let a = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"
    let t = "", r = crypto.getRandomValues(new Uint8Array(lenght))
    for (let i = 0; i < lenght; i++)
      t += a[63&r[i]]
    return t
  }
}