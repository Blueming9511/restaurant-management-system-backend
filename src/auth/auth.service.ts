import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) { }

    async signup(dto: AuthDto) {

        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                },
            });
            const { hash: userHash, ...userWithoutHash } = user;
            return userWithoutHash;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
        }

    }

    async signin(dto) {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        // if user not found, throw exception
        if (!user) throw new ForbiddenException('Credentials incorrect: Email not found');

        // compare password
        const passwordMatches = await argon.verify(user.hash, dto.password);

        // if password does not match, throw exception
        if (!passwordMatches) throw new ForbiddenException('Credentials incorrect: Password incorrect');

        // remove hash from user object
        const { hash, ...userWithoutHash } = user;

        return userWithoutHash;
       
    }
}