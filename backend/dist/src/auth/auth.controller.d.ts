import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
        id: string;
        nom: string;
        prenom: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    login(body: any): Promise<{
        access_token: string;
        user: {
            id: string;
            nom: string;
            prenom: string;
            email: string;
            isActive: true;
        };
    }>;
    getProfile(req: any): any;
}
