/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */

const { collectResults, printSummary } = require('./license-headers/runner');
const CONFIG = require('./license-headers/config');

function main() {
    const results = collectResults(CONFIG.rootDir);
    printSummary(results);

    if (results.errors > 0) {
        process.exit(1);
    }
}

main();