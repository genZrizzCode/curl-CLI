#!/usr/bin/env node

import { program } from "commander";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import readline from "readline";

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));

program
    .name('curlme')
    .description('A CLI to make an ASCII animation executable via curl')
    .version(pkg.version);
program
    .command('now')
    .description('Make a template for a curlable ASCII animation with golang')
    .option('-d,--default', 'Use the default template')
    .action((options) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question("Enter your Go project name: ", (projectName) => {
            if (!projectName) {
                rl.close();
                console.log("Project name cannot be empty.");
                process.exit(1);
            }
            function finish(projectName, numFrames, fps) {
                rl.close();
                if (!fs.existsSync(projectName)) {
                    fs.mkdirSync(projectName);
                }
                // Create go.mod
                const goModContent = `module ${projectName}\n\ngo 1.24.5\n`;
                fs.writeFileSync(path.join(projectName, "go.mod"), goModContent);

                // Generate frames
                let frameColors = ["31", "32", "33", "34", "35", "36", "37", "91", "92", "93", "94", "95", "96", "97"];
                let framesArr = [];
                for (let i = 0; i < numFrames; i++) {
                    let color = frameColors[i % frameColors.length];
                    framesArr.push(`\\x1b[${color}m  (o_o) frame ${i+1}  \\x1b[0m`);
                }
                const goFrames = framesArr.map(f => `    "${f}",`).join("\n");
                const sleepMs = Math.round(1000 / fps);
                const mainGoContent = `package main\n\nimport (\n    \"fmt\"\n    \"time\"\n)\n\nvar frames = []string{\n${goFrames}\n}\n\nfunc main() {\n    for i := 0; i < ${numFrames}; i++ {\n        fmt.Print(\"\\x1b[H\\x1b[2J\") // Clear screen\n        fmt.Println(frames[i%len(frames)])\n        time.Sleep(${sleepMs} * time.Millisecond)\n    }\n}\n`;
                fs.writeFileSync(path.join(projectName, "main.go"), mainGoContent);
                console.log(`Go project created in ./${projectName} with go.mod and main.go!`);
            }
            if (options.default) {
                finish(projectName, 4, 5);
            } else {
                rl.question("How many frames? (max 240): ", (framesInput) => {
                    let numFrames = parseInt(framesInput, 10);
                    if (isNaN(numFrames) || numFrames < 1 || numFrames > 240) {
                        rl.close();
                        console.log("Invalid number of frames. Must be between 1 and 240.");
                        process.exit(1);
                    }
                    rl.question("Frames per second? (max 120): ", (fpsInput) => {
                        let fps = parseInt(fpsInput, 10);
                        if (isNaN(fps) || fps < 1 || fps > 120) {
                            rl.close();
                            console.log("Invalid FPS. Must be between 1 and 120.");
                            process.exit(1);
                        }
                        finish(projectName, numFrames, fps);
                    });
                });
            }
        });
    });
program
    .command('ping [host]')
    .description('Send one ping packet to a website (default: go.dev) and print pong with the time in ms')
    .action((host = 'go.dev') => {
        let platform = process.platform;
        let pingCmd;
        if (platform === 'win32') {
            pingCmd = `ping -n 1 ${host}`;
        } else {
            pingCmd = `ping -c 1 ${host}`;
        }
        try {
            const output = execSync(pingCmd, { encoding: 'utf8' });
            // Parse time from output
            let timeMatch = output.match(/time[=<]([0-9.]+) ?ms/);
            if (!timeMatch && platform === 'win32') {
                // Windows output: time=XXms
                timeMatch = output.match(/time=([0-9.]+)ms/);
            }
            if (timeMatch) {
                const ms = timeMatch[1];
                console.log(`\x1b[1m\x1b[32mPONG! 🏓\x1b[0m  ${ms} ms to ${host}`);
            } else {
                console.log(`\x1b[1m\x1b[32mPONG! 🏓\x1b[0m (time not found) to ${host}`);
            }
        } catch (err) {
            console.error('Ping failed:', err.message);
        }
    });
    
program.parse(process.argv);