import {defineConfig, globalIgnores} from "eslint/config";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";

export default defineConfig([
	globalIgnores(["build/*", "coverage/*"]),
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...pluginVue.configs["flat/recommended"],

	{
		files: ["**/*.js", "**/*.ts", "**/*.tsx", "**/*.vue"],
		"plugins": {
			"@stylistic": stylistic,
			"@typescript-eslint/eslint-plugin": tseslint.plugin,
		},
		"languageOptions": {
			parser: vueParser,
			parserOptions: {
				parser: tseslint.parser,
				project: "./tsconfig.json",
				extraFileExtensions: [".vue"],
				sourceType: "module",
				ecmaVersion: "latest",
			},
			globals: {
				"system": true,
				"Promise": true,
				...globals.browser,
			},
		},
	},
	{
		rules: {
			"vue/multi-word-component-names": "off",
			"curly": [
				2,
				"multi-line",
			],
			"init-declarations": "off",
			"no-console": "warn",
			"no-case-declarations": "error",
			"no-dupe-class-members": "error",
			"no-extra-boolean-cast": "off",
			"no-lonely-if": "off",
			"no-unused-vars": "off",
			"no-var": "error",
			"object-shorthand": [
				"error",
				"always",
			],
			"one-var": [
				"error",
				"never",
			],
			"vue/html-indent": [
				"error",
				"tab",
				{
					"attribute": 1,
					"baseIndent": 0,
					"closeBracket": 0,
					"alignAttributesVertically": true,
				},
			],
			"vue/script-indent": [
				"error",
				"tab",
				{
					"baseIndent": 0,
					"switchCase": 1,
				},
			],
			"@stylistic/array-bracket-spacing": [
				"error",
				"never",
			],
			"@stylistic/arrow-spacing": [
				"error",
				{
					"before": true,
					"after": true,
				},
			],
			"@stylistic/brace-style": [
				"error",
				"stroustrup",
				{
					"allowSingleLine": true,
				},
			],
			"@stylistic/comma-dangle": [
				"error",
				{
					"arrays": "always-multiline",
					"objects": "always-multiline",
					"imports": "always-multiline",
					"exports": "always-multiline",
					"enums": "always-multiline",
					"generics": "always-multiline",
					"tuples": "always-multiline",
				},
			],
			"@stylistic/comma-spacing": [
				"error",
				{
					"before": false,
					"after": true,
				},
			],
			"@stylistic/computed-property-spacing": [
				"error",
				"never",
			],

			"@stylistic/function-call-spacing": "error",
			"@stylistic/indent": [
				"error",
				"tab",
				{
					"SwitchCase": 1,
					"ignoredNodes": ["TemplateLiteral *"],
				},
			],

			"@stylistic/key-spacing": [
				"error",
				{
					"beforeColon": false,
					"afterColon": true,
				},
			],
			"@stylistic/keyword-spacing": [
				"error",
				{
					"before": true,
					"after": true,
				},
			],
			"@stylistic/max-len": [
				"warn",
				{
					"code": 80,
					"ignoreStrings": true,
					"ignoreComments": true,
					"ignoreTemplateLiterals": true,
					"ignoreRegExpLiterals": true,
				},
			],
			"@stylistic/member-delimiter-style": "error",
			"@stylistic/no-extra-parens": [
				"error",
				"all",
				{
					"ignoreJSX": "all",
				},
			],
			"@stylistic/no-extra-semi": "error",
			"@stylistic/no-multiple-empty-lines": [
				"warn",
				{
					"max": 1,
				},
			],
			"@stylistic/no-multi-spaces": "error",
			"@stylistic/no-trailing-spaces": "error",
			"@stylistic/object-curly-spacing": [
				"error",
				"never",
			],
			"@stylistic/operator-linebreak": [
				"error",
				"before",
			],
			"@stylistic/quotes": [
				"error",
				"double",
			],
			"@stylistic/space-in-parens": [
				"error",
				"never",
			],
			"@stylistic/space-infix-ops": ["error", {"int32Hint": false}],
			"@stylistic/template-curly-spacing": [
				"error",
				"never",
			],
			"@stylistic/type-annotation-spacing": [
				"error",
				{
					"overrides": {
						colon: {before: false, after: true},
					},
				},
			],
			"@stylistic/semi": [
				"error",
				"always",
			],
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					"vars": "all",
					"args": "after-used",
					"ignoreRestSiblings": false,
				},
			],
			"@typescript-eslint/await-thenable": "warn",
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/adjacent-overload-signatures": "error",
			"@typescript-eslint/array-type": [
				"error",
				{
					"default": "array",
				},
			],
			"@typescript-eslint/class-literal-property-style": "error",
			"@typescript-eslint/consistent-indexed-object-style": "error",
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					"prefer": "type-imports",
					"fixStyle": "inline-type-imports",
				},
			],
			"@typescript-eslint/no-import-type-side-effects": "error",
			"@typescript-eslint/dot-notation": [
				"error",
				{
					"allowIndexSignaturePropertyAccess": true,
				},
			],
			"@typescript-eslint/explicit-function-return-type": [
				"error",
				{
					allowExpressions: false,
					allowTypedFunctionExpressions: true,
				},
			],
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{accessibility: "no-public"},
			],
			"@typescript-eslint/no-array-constructor": "error",
			"@typescript-eslint/no-confusing-non-null-assertion": "error",
			"@typescript-eslint/no-confusing-void-expression": [
				"error",
				{
					"ignoreArrowShorthand": true,
				},
			],
			"@typescript-eslint/no-dynamic-delete": "off",
			"@typescript-eslint/no-empty-function": "off",
			"@typescript-eslint/no-extra-non-null-assertion": "error",
			"@typescript-eslint/no-extraneous-class": "off",
			"@typescript-eslint/no-floating-promises": [
				"error",
				{
					"ignoreVoid": true,
					"ignoreIIFE": true,
				},
			],
			"@typescript-eslint/no-for-in-array": "error",
			"@typescript-eslint/no-implied-eval": "error",
			"@typescript-eslint/no-inferrable-types": "error",
			"@typescript-eslint/no-invalid-this": "error",
			"@typescript-eslint/no-invalid-void-type": "error",
			"@typescript-eslint/no-loop-func": "error",
			"@typescript-eslint/no-magic-numbers": "off",
			"@typescript-eslint/no-misused-new": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/no-namespace": "error",
			"@typescript-eslint/no-non-null-asserted-optional-chain": "error",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-parameter-properties": "off",
			"@typescript-eslint/no-redeclare": "error",
			"@typescript-eslint/no-require-imports": "error",
			"@typescript-eslint/no-shadow": "off",
			"@typescript-eslint/no-this-alias": "error",
			"@typescript-eslint/no-throw-literal": "off",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			"@typescript-eslint/no-unnecessary-condition": "error",
			"@typescript-eslint/no-unnecessary-type-arguments": "off",
			"@typescript-eslint/no-unnecessary-type-assertion": "error",
			"@typescript-eslint/no-unnecessary-type-constraint": "error",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			"@typescript-eslint/no-unused-expressions": "error",
			"@typescript-eslint/no-use-before-define": "error",
			"@typescript-eslint/no-useless-constructor": "error",
			"@typescript-eslint/prefer-as-const": "error",
			"@typescript-eslint/prefer-enum-initializers": "error",
			"@typescript-eslint/prefer-function-type": "error",
			"@typescript-eslint/prefer-includes": "error",
			"@typescript-eslint/prefer-literal-enum-member": "error",
			"@typescript-eslint/prefer-namespace-keyword": "error",
			"@typescript-eslint/prefer-nullish-coalescing": "off",
			"@typescript-eslint/prefer-optional-chain": "error",
			"@typescript-eslint/prefer-readonly-parameter-types": "off",
			"@typescript-eslint/prefer-reduce-type-parameter": "error",
			"@typescript-eslint/prefer-string-starts-ends-with": "error",
			"@typescript-eslint/promise-function-async": "off",
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/require-await": "error",
			"@typescript-eslint/restrict-plus-operands": "error",
			"@typescript-eslint/restrict-template-expressions": "error",
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/triple-slash-reference": "error",

		},
	},
]);