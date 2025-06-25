import { fixupConfigRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import prettier from "eslint-plugin-prettier"
import { defineConfig } from "eslint/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import babelParser from "@babel/eslint-parser"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
})

export default defineConfig([
	{
		extends: fixupConfigRules(compat.extends("@react-native", "prettier")),
		plugins: { prettier },
		languageOptions: {
			parser: babelParser,
		},
		rules: {
			"react/react-in-jsx-scope": "off",
			"indent": ["error", "tab", { SwitchCase: "1" }],
			"no-tabs": "off",
			"prettier/prettier": [
				"error",
				{
					semi: false,
					quoteProps: "consistent",
					singleQuote: false,
					trailingComma: "es5",
					useTabs: true,
					singleAttributePerLine: true,
				},
			],
		},
	},
	{
		ignores: ["node_modules/", "lib/"],
	},
])
