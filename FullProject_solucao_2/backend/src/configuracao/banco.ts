import { Pool } from "pg";
import { ambiente } from "./ambiente";

export const banco = new Pool({ connectionString: ambiente.URL_BANCO });
