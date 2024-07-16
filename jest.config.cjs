const configParams = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    testEnvironment: 'jest-environment-jsdom',
    "transform": {"\\.js$": "<rootDir>/customtransformer.js"},
    modulePathIgnorePatterns: ['<rootDir>/src/__tests__/constants', '<rootDir>/src/__tests__/ignore', '<rootDir>/src/__tests__/example'],
    "moduleNameMapper": {
      "^axios$": "axios/dist/node/axios.cjs",
      "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/mocks/fileMock.js",
      "\\.(css|less)$": "<rootDir>/mocks/fileMock.js"
    },
};

module.exports = configParams;