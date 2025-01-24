import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoService {
    constructor(private prismaService: PrismaService) { }
    async createPhoto(productId: number, filename: string) {

        await this.prismaService.photo.create({
            data: {
                path: productId + '/' + filename,
                productId: productId
            }
        })
    }
    async findById(id: number) {
        return await this.prismaService.photo.findUnique({
            where: { id }
        })
    }
    async deletePhoto(id: number) {
        await this.prismaService.photo.delete({ where: { id } })
    }
}
