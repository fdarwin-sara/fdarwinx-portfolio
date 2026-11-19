import webVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [...webVitals, ...typescript, { ignores: [".next/**", "next-env.d.ts", "test-results/**"] }];

export default config;
