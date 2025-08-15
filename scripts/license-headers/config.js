/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */

const path = require('path');

module.exports = {
    rootDir: process.cwd(),
    licenseHeader: ` * @license
 * Copyright (c) ${new Date().getFullYear()} Johan Hoareau
 * SPDX-License-Identifier: MIT
 `,
    commentFormats: {
        default: { start: '/*!', end: '*/' },
        '.js': { start: '/*!', end: '*/' },
        '.jsx': { start: '/*!', end: '*/' },
        '.ts': { start: '/*!', end: '*/' },
        '.tsx': { start: '/*!', end: '*/' },
        '.md': { start: '<!--', end: '-->' },
        '.sh': { prefix: '#' },
        '.py': { prefix: '#' },
    },
    ignorePatterns: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/__tests__/**',
        '**/*.test.*',
        '**/*.spec.*',
        '**/*.d.ts',
        '**/index.ts',
        '**/.expo/**',
        '**/coverage/**',
        '**/ios/**',
        '**/android/**',
        '**/package.json',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/Podfile.lock',
        '**/Gemfile.lock',
    ],
    fileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.md', '.sh', '.py'],
    excludeCopyrightCheck: ['*.json', '*.snap', '*.png', '*.jpg', '*.svg', '*.lock'],
};