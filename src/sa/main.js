import { AuthService } from './service/auth.sevice.js';

(async function() {
    await AuthService.getInstance().checkLogin();
    import('./component/sa.component.js');
})();
