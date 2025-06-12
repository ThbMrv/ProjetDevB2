"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserController = class UserController {
    constructor(userService, userRepo) {
        this.userService = userService;
        this.userRepo = userRepo;
    }
    async register(body) {
        return this.userService.createUser(body.email, body.password, body.name, body.role);
    }
    async login(body) {
        const user = await this.userService.findByEmail(body.email);
        if (user && await bcrypt.compare(body.password, user.password)) {
            return {
                message: 'Connexion réussie ✅',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        }
        return { message: 'Email ou mot de passe invalide ❌' };
    }
    // ✅ Modification du mot de passe
    async updatePassword(currentPassword, newPassword, req, res) {
        const sessionUser = req.session?.user;
        if (!sessionUser) {
            return res.status(401).send('Non connecté');
        }
        const user = await this.userRepo.findOneBy({ id: sessionUser.id });
        if (!user) {
            return res.status(404).send('Utilisateur introuvable');
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(400).send('Mot de passe actuel incorrect');
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await this.userRepo.save(user);
        return res.redirect('/profil');
    }
    // 🛠️ Admin: suppression d’un utilisateur
    async deleteUser(id, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.userRepo.delete(id);
        return { success: true };
    }
    // 🛠️ Admin: suppression d’un projet
    async deleteProject(id, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.pitchdeckRepo.delete(id);
        return { success: true };
    }
    // 🛠️ Admin: édition d’un projet
    async editProject(id, file, status, req) {
        const user = req.session?.user;
        if (!user || user.role !== 'admin')
            throw new common_1.UnauthorizedException();
        await this.pitchdeckRepo.update(id, { file, status });
        return { success: true };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('auth/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('auth/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/profil/password'),
    __param(0, (0, common_1.Body)('currentPassword')),
    __param(1, (0, common_1.Body)('newPassword')),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('/admin/users/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Post)('/admin/projects/:id/delete'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteProject", null);
__decorate([
    (0, common_1.Post)('/admin/projects/:id/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('file')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "editProject", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [user_service_1.UserService,
        typeorm_2.Repository])
], UserController);
