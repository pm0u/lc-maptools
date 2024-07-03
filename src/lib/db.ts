import {
  dbDatabase,
  dbHost,
  dbPassword,
  dbPort,
  dbUrl,
  dbUsername,
} from "@/env-server";
import postgres from "postgres";

export const sql = dbUrl
  ? postgres(dbUrl)
  : postgres({
      host: dbHost,
      database: dbDatabase,
      username: dbUsername,
      password: dbPassword,
      port: dbPort,
    });
