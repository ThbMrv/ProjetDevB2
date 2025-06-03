import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: any; // 👉 mets ici ton vrai type utilisateur si tu veux, sinon "any" marche
  }
}
