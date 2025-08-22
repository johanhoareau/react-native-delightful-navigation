/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */

// import { fixupConfigRules } from "@eslint/compat"
// import { FlatCompat } from "@eslint/eslintrc"
// import js from "@eslint/js"
// import prettier from "eslint-plugin-prettier"
// import licenseHeader from "eslint-plugin-license-header"
// import tsParser from "@typescript-eslint/parser"
// import { defineConfig } from "eslint/config"
// import path from "node:path"
// import { fileURLToPath } from "node:url"
// import babelParser from "@babel/eslint-parser"
// import tsEslintPlugin from "@typescript-eslint/eslint-plugin"
// import licenseGenerator from './.license-header-generator.js';

// const __filename = fileURLToPath(
// 	import.meta.url)
// const __dirname = path.dirname(__filename)
// const compat = new FlatCompat({
// 	baseDirectory: __dirname,
// 	recommendedConfig: js.configs.recommended,
// 	allConfig: js.configs.all,
// })

// export default defineConfig([
// 	// Configuration JavaScript
// 	{
// 		files: ["**/*.{js,jsx}"],
// 		extends: fixupConfigRules(compat.extends("@react-native", "prettier")),
// 		settings: {
// 			react: {
// 				version: '19.0.0',
// 			},
// 		},
// 		plugins: {
// 			prettier,
// 			"license-header": licenseHeader,
// 		},
// 		languageOptions: {
// 			parser: babelParser,
// 		},
// 		rules: {
// 			"license-header/header": [
// 				"error",
// 				licenseGenerator
// 			],
// 			"react/react-in-jsx-scope": "off",
// 			"indent": ["error", "tab", { SwitchCase: 1 }],
// 			"no-tabs": "off",
// 			"prettier/prettier": [
// 				"error",
// 				{
// 					semi: false,
// 					quoteProps: "consistent",
// 					singleQuote: false,
// 					trailingComma: "es5",
// 					useTabs: true,
// 					singleAttributePerLine: true,
// 				},
// 			],
// 		},
// 	},
// 	// Configuration TypeScript (Nouveau)
// 	{
// 		files: ["**/*.{ts,tsx}"],
// 		plugins: {
// 			"license-header": licenseHeader,
// 			"@typescript-eslint": tsEslintPlugin,
// 			prettier,
// 		},
// 		settings: {
// 			react: {
// 				version: '19.0.0',
// 			},
// 		},
// 		languageOptions: {
// 			parser: tsParser,
// 			parserOptions: {
// 				project: "./tsconfig.json",
// 			},
// 		},
// 		rules: {
// 			"license-header/header": [
// 				"error",
// 				licenseGenerator
// 			],
// 			"@typescript-eslint/no-unused-vars": "error",
// 			"indent": "off", // Désactivé pour TypeScript
// 			"no-tabs": "off",
// 			"prettier/prettier": [
// 				"error",
// 				{
// 					semi: false,
// 					quoteProps: "consistent",
// 					singleQuote: false,
// 					trailingComma: "es5",
// 					useTabs: true,
// 					singleAttributePerLine: true,
// 				},
// 			],
// 		},
// 	}, {
// 		ignores: [
// 			"**/node_modules/**",
// 			"**/dist/**",
// 			"**/lib/**",
// 			"**/.yarn/**",
// 			"**/*.config.{js,ts,cjs,mjs}",
// 			"**/__fixtures__/**",
// 			"**/__mocks__/**",
// 			"**/coverage/**",
// 			"**/android/**",
// 			"**/ios/**"
// 		]
// 	}

// ])