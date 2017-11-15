module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "no-console": 1,
        "indent": ["error", 2],
        "eol-last": ["error", "always"],
        "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0, maxBOF: 0 }],
        "no-trailing-spaces": "error",
    }
};