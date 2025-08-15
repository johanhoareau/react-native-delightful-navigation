/*!
 * @license
 * Copyright (c) 2025 Johan Hoareau
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs');
const path = require('path');
const {
    formatHeader,
    shouldIgnore,
    isCopyrightCheckExcluded,
    isHeaderValid,
    removeOldHeaders,
    addHeaderWithShebang
} = require('./utils');
const CONFIG = require('./config');

function processFile(filePath) {
    if (shouldIgnore(filePath)) return { status: 'ignored', filePath };

    const extension = path.extname(filePath);
    if (!CONFIG.fileExtensions.includes(extension)) return { status: 'skipped', filePath };

    let content;
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        return { status: 'error', filePath, message: `Erreur de lecture: ${error.message}` };
    }

    const filename = path.basename(filePath);
    if (isCopyrightCheckExcluded(filename)) return { status: 'excluded', filePath };

    const expectedHeader = formatHeader(extension);

    if (isHeaderValid(content, expectedHeader)) {
        return { status: 'valid', filePath };
    }

    const cleanedContent = removeOldHeaders(content);
    const newContent = addHeaderWithShebang(cleanedContent, expectedHeader);

    try {
        fs.writeFileSync(filePath, newContent);
        return { status: 'fixed', filePath };
    } catch (error) {
        return { status: 'error', filePath, message: `Erreur d'écriture: ${error.message}` };
    }
}

function walkDirectory(dir, results) {
    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                walkDirectory(fullPath, results);
            } else if (entry.isFile()) {
                const result = processFile(fullPath);
                results[result.status]++;
                results.details.push(result);
            }
        }
    } catch (error) {
        if (error.code === 'EACCES' || error.code === 'EPERM') {
            results.details.push({
                filePath: dir,
                status: 'error',
                message: `Accès refusé: ${error.message}`
            });
            results.errors++;
        } else {
            results.details.push({
                filePath: dir,
                status: 'error',
                message: `Erreur de lecture dossier: ${error.message}`
            });
            results.errors++;
        }
    }
}

function collectResults(rootDir) {
    const results = {
        valid: 0,
        fixed: 0,
        ignored: 0,
        skipped: 0,
        excluded: 0,
        errors: 0,
        details: []
    };

    console.log('Vérification des en-têtes de licence...');
    console.log('Répertoire racine:', rootDir);

    const startTime = Date.now();
    walkDirectory(rootDir, results);

    results.duration = (Date.now() - startTime) / 1000;
    return results;
}

function printSummary(results) {
    console.log('\n===== RÉSULTATS =====');
    console.log(`✅ Validés:     ${results.valid}`);
    console.log(`🛠️  Corrigés:    ${results.fixed}`);
    console.log(`⏩ Ignorés:     ${results.ignored}`);
    console.log(`↩️ Exclus:      ${results.excluded}`);
    console.log(`🚨 Erreurs:     ${results.errors}`);
    console.log(`\nOpération terminée en ${results.duration.toFixed(2)}s !`);

    if (results.fixed > 0) {
        console.log('\nFichiers corrigés:');
        results.details
            .filter(r => r.status === 'fixed')
            .forEach(r => console.log(`- ${r.filePath}`));
    }

    if (results.errors > 0) {
        console.log('\nErreurs rencontrées:');
        results.details
            .filter(r => r.status === 'error')
            .forEach(r => console.log(`- ${r.filePath}: ${r.message}`));
    }
}

module.exports = {
    collectResults,
    printSummary
};