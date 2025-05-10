module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "no-unused-vars": ["off", { argsIgnorePattern: "^_" }],
    "no-empty": "off",
    "no-undef": "off",
  },
};
