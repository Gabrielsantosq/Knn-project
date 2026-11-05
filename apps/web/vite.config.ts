import { defineConfig, loadEnv} from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"


/*
const config = defineConfig({
  envDir: path.resolve(__dirname, "../../"),
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config

*/


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname, "../../"), "")

  Object.assign(process.env, env)

  return {
    envDir: path.resolve(import.meta.dirname, "../../"),
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  }
})
