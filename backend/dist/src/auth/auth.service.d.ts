import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(data: any): Promise<{
        id: string;
        nom: string;
        prenom: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(data: any): Promise<{
        access_token: string;
        user: {
            id: string;
            nom: string;
            prenom: string;
            email: string;
            isActive: true;
        };
    }>;
}
