import { WebsiteView } from './website.view.js';
import { AuthService } from './auth.sevice.js';

(async function() {
    await AuthService.getInstance().checkLogin();
    new WebsiteView('app-websites');
})();
