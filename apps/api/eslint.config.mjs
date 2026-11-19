import typescript from "typescript-eslint";

const config = [{ ignores: ["dist/**"] }, ...typescript.configs.recommended];

export default config;
