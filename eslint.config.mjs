import { fixupConfigRules } from "@eslint/compat"
import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import prettier from "eslint-plugin-prettier"
import { defineConfig } from "eslint/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import babelParser from "@babel/eslint-parser"
import typescriptParser from "@typescript-eslint/parser"
import typescriptPlugin from "@typescript-eslint/eslint-plugin"

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default defineConfig([{
        files: ["**/*.js", "**/*.jsx"],
        extends: fixupConfigRules(compat.extends("@react-native", "prettier")),
        plugins: { prettier },
        languageOptions: {
            parser: babelParser,
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "indent": ["error", "tab", { SwitchCase: 1 }],
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
        files: ["**/*.ts", "**/*.tsx"],
        plugins: {
            "@typescript-eslint": typescriptPlugin,
        },
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_"
                }
            ],
        },
    },
    {
        ignores: [
            "node_modules/",
            "lib/",
            "**/*.config.{js,ts,cjs,mjs}"
        ],
    },
])