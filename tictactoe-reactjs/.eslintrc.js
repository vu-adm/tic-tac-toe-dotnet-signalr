module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: [
		'plugin:vue/strongly-recommended',
		'eslint:recommended'
	],
	rules: {
		'no-var': 2,
		'indent': ['error', 'tab'],
		'no-tabs': 0,
		'semi': [
			'error',
			'always'
		],
		'quotes': [
			'error',
			'single'
		],
		'space-before-function-paren': ['error', 'never'],
		'no-console': 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
};
