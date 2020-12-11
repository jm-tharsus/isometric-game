module.exports = {
	'env': {
		'browser': true,
		'commonjs': true,
		'es6': true,
		'node': false
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 2017
	},
	'rules': {
		'indent': ['warn', 'tab'],
		'no-mixed-spaces-and-tabs': ['warn'],
		'no-console': ['off'],
		'semi': ['warn', 'always'],
		'getter-return': 0,
		'for-direction': 0,
		'no-trailing-spaces': ['warn', { 'skipBlankLines': true }],
		'keyword-spacing': ['warn', { 'before': true, 'after': true }],
		'space-before-blocks': 'warn',
		'camelcase': ['warn', { 'properties': 'never' }],
		'brace-style': ['warn'],
		'no-unused-vars': 'warn',
		'quotes': ['warn', 'single', { 'allowTemplateLiterals': true, 'avoidEscape': true }],
		'jsx-quotes': ['warn', 'prefer-double'],
		'comma-spacing': ['warn', { 'before': false, 'after': true }],
		'curly': ['warn', 'all'],
		'arrow-spacing': ['warn', { 'before': true, 'after': true }],
		'object-curly-spacing': ['warn', 'always'],
		'arrow-parens': ['warn', 'as-needed']
	}
};
