"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_session_1 = __importDefault(require("express-session"));
const path_1 = require("path");
const swagger_1 = require("@nestjs/swagger");
const hbs_1 = __importDefault(require("hbs"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    // 🔐 Sessions utilisateur
    app.use((0, express_session_1.default)({
        secret: 'INVESTNET_SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 3600000, // 1h
            secure: false,
        },
    }));
    // 📁 Dossiers statiques
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public')); // ex: /public/uploads/image.jpg
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.setViewEngine('hbs');
    hbs_1.default.registerHelper('eq', (a, b) => a === b);
    // 🌐 Swagger
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Investhet API')
        .setDescription('Documentation auto de ton API REST NestJS')
        .setVersion('1.0.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
