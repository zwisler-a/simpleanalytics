import { Server } from '@zwisler/bridge';

import { EventRoute } from './route/event.route';
import { WebsiteRoute } from './route/website.route';
import { ServerInit } from './server-init';
import { EventService } from './service/event.service';
import { OrmService } from './service/orm.service';
import { WebsiteService } from './service/website.service';
import { generateTrackingCookie } from './cookie.middleware';
import { Config } from './config.interface';

const cookieParser = require('cookie-parser');
const cors = require('cors');
const config: Config = require('./config.json');

@Server({
  debug: config.debug,
  port: config.port,
  providers: [OrmService, WebsiteService, EventService],
  resolve: ServerInit,
  staticPath: ['./src/sa'],
  middleware: [cors(), cookieParser(), generateTrackingCookie],
  routes: [WebsiteRoute, EventRoute]
})
export class SaServer {}