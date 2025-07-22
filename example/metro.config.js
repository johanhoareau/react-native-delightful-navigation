const path = require("path")
const { getDefaultConfig } = require("@expo/metro-config")
const exclusionList = require('metro-config/src/defaults/exclusionList');
const { withMetroConfig } = require("react-native-monorepo-config")
const {
    wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config")

const root = path.resolve(__dirname, "..")

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = withMetroConfig(getDefaultConfig(__dirname), {
    root,
    dirname: __dirname,
})

config.resolver.unstable_enablePackageExports = true

config.watchFolders = [root]

config.resolver.extraNodeModules = {
    'react-native-delightful-navigation': path.resolve(root, 'src'),
    'react-native': path.resolve(root, 'node_modules/react-native'),
    'react-native-reanimated': path.resolve(root, 'node_modules/react-native-reanimated')
        // react: path.resolve(root, 'node_modules/react'),
}

config.resolver.blacklistRE = exclusionList([
    /react-native-delightful-navigation\/lib\/.*/,
    /react-native-delightful-navigation\/node_modules\/react-native-reanimated\/.*/,
]);

module.exports = wrapWithReanimatedMetroConfig(config)