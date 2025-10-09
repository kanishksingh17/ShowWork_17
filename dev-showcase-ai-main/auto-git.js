#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AutoGit {
    constructor() {
        this.repoPath = process.cwd();
        this.gitPath = path.join(this.repoPath, '.git');
        this.configPath = path.join(this.repoPath, '.auto-git-config.json');
        this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                this.config = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
            } else {
                this.config = {
                    autoCommit: true,
                    autoPush: true,
                    commitMessage: 'Auto-commit: {timestamp}',
                    commitInterval: 300000, // 5 minutes
                    excludePatterns: [
                        'node_modules/**',
                        '.git/**',
                        'dist/**',
                        'build/**',
                        '*.log',
                        '.env',
                        '.env.local',
                        '.env.production',
                        '.env.development'
                    ],
                    branch: 'main'
                };
                this.saveConfig();
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.config = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            autoCommit: true,
            autoPush: true,
            commitMessage: 'Auto-commit: {timestamp}',
            commitInterval: 300000,
            excludePatterns: [
                'node_modules/**',
                '.git/**',
                'dist/**',
                'build/**',
                '*.log',
                '.env',
                '.env.local',
                '.env.production',
                '.env.development'
            ],
            branch: 'main'
        };
    }

    saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
        }
    }

    execGitCommand(command) {
        try {
            return execSync(command, { 
                cwd: this.repoPath, 
                encoding: 'utf8',
                stdio: 'pipe'
            });
        } catch (error) {
            console.error(`Git command failed: ${command}`, error.message);
            return null;
        }
    }

    getGitStatus() {
        try {
            const status = this.execGitCommand('git status --porcelain');
            return status ? status.trim().split('\n').filter(line => line.length > 0) : [];
        } catch (error) {
            console.error('Error getting git status:', error);
            return [];
        }
    }

    shouldExcludeFile(filePath) {
        return this.config.excludePatterns.some(pattern => {
            const regex = new RegExp(pattern.replace(/\*/g, '.*').replace(/\//g, '\\/'));
            return regex.test(filePath);
        });
    }

    getChangedFiles() {
        const status = this.getGitStatus();
        const changedFiles = [];

        status.forEach(line => {
            const status = line.substring(0, 2);
            const filePath = line.substring(3);

            if (!this.shouldExcludeFile(filePath)) {
                changedFiles.push({
                    status: status.trim(),
                    path: filePath
                });
            }
        });

        return changedFiles;
    }

    hasChanges() {
        const changedFiles = this.getChangedFiles();
        return changedFiles.length > 0;
    }

    generateCommitMessage() {
        const timestamp = new Date().toISOString();
        return this.config.commitMessage.replace('{timestamp}', timestamp);
    }

    commitChanges() {
        if (!this.hasChanges()) {
            console.log('No changes to commit');
            return false;
        }

        try {
            // Add all changes
            this.execGitCommand('git add .');
            
            // Generate commit message
            const commitMessage = this.generateCommitMessage();
            
            // Commit changes
            const result = this.execGitCommand(`git commit -m "${commitMessage}"`);
            
            if (result) {
                console.log(`✅ Committed changes: ${commitMessage}`);
                return true;
            }
        } catch (error) {
            console.error('Error committing changes:', error);
        }
        
        return false;
    }

    pushChanges() {
        if (!this.config.autoPush) {
            console.log('Auto-push is disabled');
            return false;
        }

        try {
            const result = this.execGitCommand(`git push origin ${this.config.branch}`);
            
            if (result) {
                console.log(`✅ Pushed changes to origin/${this.config.branch}`);
                return true;
            }
        } catch (error) {
            console.error('Error pushing changes:', error);
        }
        
        return false;
    }

    performAutoCommit() {
        console.log('🔄 Checking for changes...');
        
        if (!this.hasChanges()) {
            console.log('No changes detected');
            return;
        }

        console.log('📝 Changes detected, committing...');
        
        if (this.commitChanges()) {
            if (this.config.autoPush) {
                console.log('🚀 Pushing to GitHub...');
                this.pushChanges();
            }
        }
    }

    startWatching() {
        console.log('🤖 Auto-Git started');
        console.log(`📁 Watching: ${this.repoPath}`);
        console.log(`⏰ Commit interval: ${this.config.commitInterval / 1000}s`);
        console.log(`🚀 Auto-push: ${this.config.autoPush ? 'enabled' : 'disabled'}`);
        console.log('Press Ctrl+C to stop\n');

        // Initial check
        this.performAutoCommit();

        // Set up interval
        setInterval(() => {
            this.performAutoCommit();
        }, this.config.commitInterval);
    }

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.saveConfig();
        console.log('✅ Configuration updated');
    }

    showStatus() {
        console.log('📊 Auto-Git Status:');
        console.log(`   Repository: ${this.repoPath}`);
        console.log(`   Auto-commit: ${this.config.autoCommit ? 'enabled' : 'disabled'}`);
        console.log(`   Auto-push: ${this.config.autoPush ? 'enabled' : 'disabled'}`);
        console.log(`   Branch: ${this.config.branch}`);
        console.log(`   Commit interval: ${this.config.commitInterval / 1000}s`);
        
        const changedFiles = this.getChangedFiles();
        console.log(`   Changed files: ${changedFiles.length}`);
        
        if (changedFiles.length > 0) {
            console.log('   Files:');
            changedFiles.forEach(file => {
                console.log(`     ${file.status} ${file.path}`);
            });
        }
    }
}

// CLI Interface
function main() {
    const args = process.argv.slice(2);
    const autoGit = new AutoGit();

    if (args.length === 0) {
        autoGit.startWatching();
        return;
    }

    const command = args[0];

    switch (command) {
        case 'start':
        case 'watch':
            autoGit.startWatching();
            break;
            
        case 'commit':
            autoGit.performAutoCommit();
            break;
            
        case 'status':
            autoGit.showStatus();
            break;
            
        case 'config':
            if (args[1] === 'set') {
                const key = args[2];
                const value = args[3];
                
                if (key && value !== undefined) {
                    let parsedValue = value;
                    
                    // Parse boolean values
                    if (value === 'true') parsedValue = true;
                    if (value === 'false') parsedValue = false;
                    
                    // Parse numeric values
                    if (!isNaN(value) && !isNaN(parseFloat(value))) {
                        parsedValue = parseFloat(value);
                    }
                    
                    autoGit.updateConfig({ [key]: parsedValue });
                } else {
                    console.log('Usage: node auto-git.js config set <key> <value>');
                }
            } else {
                console.log('Current configuration:');
                console.log(JSON.stringify(autoGit.config, null, 2));
            }
            break;
            
        case 'help':
            console.log(`
Auto-Git Commands:
  start/watch    Start watching for changes and auto-commit
  commit         Perform a single commit and push
  status         Show current status and changed files
  config         Show current configuration
  config set     Set configuration value
  help           Show this help message

Examples:
  node auto-git.js                    # Start watching
  node auto-git.js commit             # Single commit
  node auto-git.js config set autoPush false
  node auto-git.js config set commitInterval 600000
            `);
            break;
            
        default:
            console.log(`Unknown command: ${command}`);
            console.log('Run "node auto-git.js help" for available commands');
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Auto-Git stopped');
    process.exit(0);
});

if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export default AutoGit;
