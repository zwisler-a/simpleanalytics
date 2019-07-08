export interface Config {
  orm: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    logging: boolean;
    synchronize: boolean;
  };
  port: number;
  debug: boolean;
}
