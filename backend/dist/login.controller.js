"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const login_dto_1 = require("./dto/login.dto");
const user_service_1 = require("./user/user.service");
let LoginController = class LoginController {
    constructor(userService) {
        this.userService = userService;
    }
    async login(req, res, body) {
        const { email, password } = body;
        const user = await this.userService.validateUser(email, password);
        if (!user) {
            console.log('❌ Tentative échouée - Email ou mot de passe incorrect');
            return res.status(401).json({ message: 'Erreur de connexion ❌' });
        }
        req.session.user = user;
        // 🖨️ Log complet de la session côté terminal
        console.log('✅ Connexion réussie');
        console.log('Session ID :', req.sessionID);
        console.log('Données session :', req.session);
        if (req.headers.accept?.includes('text/html')) {
            return res.redirect('/accueil');
        }
        return res.json({ message: 'Connexion réussie ✅' });
    }
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "logout", null);
exports.LoginController = LoginController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], LoginController);
