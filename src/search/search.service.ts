import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor (private prismaService:PrismaService,private configService:ConfigService){}
    async listProducts(page:number){
        return await this.prismaService.product.findMany({
            skip: (page-1)*this.configService.get("PRODUCT_PAGE"), // skip inicio 
            take:parseInt(this.configService.get("PRODUCT_PAGE")), //take cuantos quieres que coja
            orderBy:{"id":"asc"},
            include:{
                ProductCategory:{
                    include:{category:true}
                },
                Photos:true 

            }

        })
    }
    async totalProducts(){
        return await this.prismaService.product.count()
    }
}
