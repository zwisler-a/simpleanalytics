import { WebsiteView } from './website.view.js';
import { AuthService } from './auth.sevice.js';

(async function() {
    await new AuthService().checkLogin();
    new WebsiteView('app-websites');
})();
