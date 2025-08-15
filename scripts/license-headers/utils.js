/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs');
const path = require('path');
const { minimatch } = require('minimatch');
const CONFIG = require('./config');

function formatHeader(extension) {
    const format = CONFIG.commentFormats[extension] || CONFIG.commentFormats.default;

    if (format.prefix) {
        return CONFIG.licenseHeader
            .split('\n')
            .map(line => (line.trim() ? `${format.prefix} ${line.trim()}` : format.prefix))
            .join('\n') + '\n\n';
    }

    return `${format.start}\n${CONFIG.licenseHeader}${format.end}\n\n`;
}

function shouldIgnore(filePath) {
    if (filePath.includes('node_modules')) return true;

    const relativePath = path.relative(CONFIG.rootDir, filePath);
    return CONFIG.ignorePatterns.some(pattern =>
        minimatch(relativePath, pattern, { dot: true, nocase: true })
    );
}

function isCopyrightCheckExcluded(filename) {
    return CONFIG.excludeCopyrightCheck.some(pattern =>
        minimatch(filename, pattern)
    );
}

function hasCopyrightHeader(content) {
    return /Copyright\s*\(c\)\s*\d{4}/.test(content);
}

function isHeaderValid(content, expectedHeader) {
    if (content.startsWith(expectedHeader)) return true;

    const normalizedContent = content.replace(/\s+/g, ' ').trim();
    const normalizedHeader = expectedHeader.replace(/\s+/g, ' ').trim();

    if (normalizedContent.startsWith(normalizedHeader)) return true;

    return hasCopyrightHeader(content.split('\n').slice(0, 10).join('\n'));
}

function removeOldHeaders(content) {
    const patterns = [
        /\/\*[\s\S]*?Copyright[\s\S]*?\*\//,
        //,
        /#.*Copyright[^]*?\n\n/
    ];

    return patterns.reduce((acc, pattern) =>
        acc.replace(pattern, ''), content);
}

function addHeaderWithShebang(content, expectedHeader) {
    if (content.startsWith('#!')) {
        const shebangEnd = content.indexOf('\n') + 1;
        const shebang = content.substring(0, shebangEnd);
        return shebang + expectedHeader + content.substring(shebangEnd);
    }
    return expectedHeader + content;
}

module.exports = {
    formatHeader,
    shouldIgnore,
    isCopyrightCheckExcluded,
    isHeaderValid,
    removeOldHeaders,
    addHeaderWithShebang
};