import { WebsiteView } from './component/website.view.js';
import { AuthService } from './service/auth.sevice.js';

(async function() {
    await AuthService.getInstance().checkLogin();
    new WebsiteView('app-websites');
})();
