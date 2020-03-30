import { config } from "./config";

export default function envToBranch(enviroment: string): string {
  if (enviroment in config) return config[enviroment];
  return enviroment;
}
