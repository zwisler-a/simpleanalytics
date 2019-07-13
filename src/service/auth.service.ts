import { Service } from '@zwisler/bridge';
const jwt = require('jsonwebtoken');

@Service()
export class AuthService {
    static secret: string;

    static authorize() {
        return (req, res, next) => {
            console.log('checkauth');
            if (!this.secret) return next();
            const authHeader = req.header('x-auth');
            if (!authHeader) return res.status(401).send();
            try {
                const tokenPayload = jwt.verify(authHeader, this.secret);
                if (!tokenPayload.admin) return res.status(403).send();
                next();
            } catch (e) {
                return res.status(401).send();
            }
        };
    }
}
