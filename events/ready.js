/*const { Events } = require('discord.js');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        const asciiArt = `
 ▄█    █▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█     ▄████████    ▄████████ 
███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███    ███    ███   ███    ███ 
███    ███   ███    ███ ███   ███   ███   ███    ███ ███▌   ███    ███   ███    █▀  
███    ███   ███    ███ ███   ███   ███   ███    ███ ███▌  ▄███▄▄▄▄██▀  ▄███▄▄▄     
███    ███ ▀███████████ ███   ███   ███ ▀█████████▀  ███▌ ▀▀███▀▀▀▀▀   ▀▀███▀▀▀     
███    ███   ███    ███ ███   ███   ███   ███        ███  ▀███████████   ███    █▄  
███    ███   ███    ███ ███   ███   ███   ███        ███    ███    ███   ███    ███ 
 ▀██████▀    ███    █▀   ▀█   ███   █▀   ▄████▀      █▀     ███    ███   ██████████ 
                                                            ███    ███                   
>-----------------------------------------------------------------------------------------<
| ~ $ > Logged in as ${client.user.tag}
| ~ $ > Loaded ${countJsFiles()} commands
| ~ $ > Run /help for help
| ~ $ > the useless webhost:) : http://localhost:53134
`;

        function countJsFiles() {
            const commandsPath = path.join(__dirname, '..', 'commands');
            let fileCount = 0;

            function countFiles(dirPath) {
                const files = fs.readdirSync(dirPath);

                files.forEach(file => {
                    const filePath = path.join(dirPath, file);
                    const stats = fs.statSync(filePath);

                    if (stats.isDirectory()) {
                        countFiles(filePath);
                    } else if (file.endsWith('.js')) {
                        fileCount += 1;
                    }
                });
            }

            countFiles(commandsPath);
            return fileCount;
        }

        const getTerminalSize = () => {
            return {
                columns: process.stdout.columns || 80,
                rows: process.stdout.rows || 24
            };
        };

        const centerText = (text) => {
            const { columns, rows } = getTerminalSize();
            const lines = text.split('\n');
            const maxLineLength = Math.max(...lines.map(line => line.length));
            const paddingHorizontal = Math.max(0, Math.floor((columns - maxLineLength - 40) / 2));
            const verticalPadding = Math.max(0, Math.floor((rows - lines.length) / 2));

            if (paddingHorizontal < 0) {
                console.warn('Warning: Horizontal padding is negative. Check terminal size.');
                return text;
            }

            const centeredLines = lines.map(line => ' '.repeat(paddingHorizontal) + line).join('\n');
            const finalCenteredText = '\n'.repeat(verticalPadding) + centeredLines;

            return finalCenteredText;
        };

        const printCenteredText = () => {
            const centeredText = centerText(asciiArt);
            readline.cursorTo(process.stdout, 0, 0);
            console.clear();
            console.log(centeredText);
        };

        const width = 30;
        const height = 9;
        const distanceFromCam = 100;
        const K1 = 20;
        const incrementSpeed = 0.6;
        const cubeWidth = 8;

        let A = 0, B = 0, C = 0;
        const zBuffer = new Array(width * height).fill(0);
        const buffer = new Array(width * height).fill(' ');

        const calculateX = (i, j, k) => {
            return j * Math.sin(A) * Math.sin(B) * Math.cos(C) - k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
                j * Math.cos(A) * Math.sin(C) + k * Math.sin(A) * Math.sin(C) + i * Math.cos(B) * Math.cos(C);
        };

        const calculateY = (i, j, k) => {
            return j * Math.cos(A) * Math.cos(C) + k * Math.sin(A) * Math.cos(C) -
                j * Math.sin(A) * Math.sin(B) * Math.sin(C) + k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
                i * Math.cos(B) * Math.sin(C);
        };

        const calculateZ = (i, j, k) => {
            return k * Math.cos(A) * Math.cos(B) - j * Math.sin(A) * Math.cos(B) + i * Math.sin(B);
        };

        const calculateForSurface = (cubeX, cubeY, cubeZ, ch) => {
            const x = calculateX(cubeX, cubeY, cubeZ);
            const y = calculateY(cubeX, cubeY, cubeZ);
            const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

            const ooz = 1 / z;

            const xp = Math.floor(width / 2 + K1 * ooz * x * 2);
            const yp = Math.floor(height / 2 + K1 * ooz * y);

            const idx = xp + yp * width;
            if (idx >= 0 && idx < width * height) {
                if (ooz > zBuffer[idx]) {
                    zBuffer[idx] = ooz;
                    buffer[idx] = ch;
                }
            }
        };

        const printCube = () => {
            buffer.fill(' ');
            zBuffer.fill(0);

            for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
                for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
                    calculateForSurface(cubeX, cubeY, -cubeWidth, '@');
                    calculateForSurface(cubeWidth, cubeY, cubeX, '$');
                    calculateForSurface(-cubeWidth, cubeY, -cubeX, '~');
                    calculateForSurface(-cubeX, cubeY, cubeWidth, '#');
                    calculateForSurface(cubeX, -cubeWidth, -cubeY, ';');
                    calculateForSurface(cubeX, cubeWidth, cubeY, '+');
                }
            }

            let output = '';
            for (let k = 0; k < width * height; k++) {
                output += (k % width === 0 ? '\n' : '') + buffer[k];
            }
            return output;
        };

        const printOutput = () => {
            const cubeOutput = printCube();
            const asciiArtLines = asciiArt.split('\n');
            const cubeLines = cubeOutput.split('\n');

            const maxLines = Math.max(asciiArtLines.length, height);
            const paddedAsciiArt = asciiArtLines.concat(new Array(maxLines - asciiArtLines.length).fill(''));
            const paddedCubeLines = cubeLines.concat(new Array(maxLines - cubeLines.length).fill(''));

            const padding = 4;
            const combinedOutput = paddedAsciiArt.map((line, index) => {
                return (line + ' '.repeat(padding) + paddedCubeLines[index]).slice(0, getTerminalSize().columns);
            }).join('\n');

            readline.cursorTo(process.stdout, 0, 0);
            console.clear();
            console.log(combinedOutput);
        };

        printCenteredText();
        printOutput();

        process.stdout.on('resize', () => {
            printCenteredText();
            printOutput();
        });

        setInterval(() => {
            A += 0.05;
            B += 0.05;
            C += 0.01;
            printOutput();
        }, 80);
    },
};*/





const { Events } = require('discord.js');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m'
};

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {

        const asciiArt = `${colors.cyan}
 ▄█    █▄     ▄████████   ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█     ▄████████    ▄████████ 
███    ███   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███    ███    ███   ███    ███ 
███    ███   ███    ███ ███   ███   ███   ███    ███ ███▌   ███    ███   ███    █▀  
███    ███   ███    ███ ███   ███   ███   ███    ███ ███▌  ▄███▄▄▄▄██▀  ▄███▄▄▄     
███    ███ ▀███████████ ███   ███   ███ ▀█████████▀  ███▌ ▀▀███▀▀▀▀▀   ▀▀███▀▀▀     
███    ███   ███    ███ ███   ███   ███   ███        ███  ▀███████████   ███    █▄  
███    ███   ███    ███ ███   ███   ███   ███        ███    ███    ███   ███    ███ 
 ▀██████▀    ███    █▀   ▀█   ███   █▀   ▄████▀      █▀     ███    ███   ██████████ 
                                                            ███    ███                   
${colors.reset}
>-----------------------------------------------------------------------------------------< ${colors.magenta}
| ~ $ > Logged in as ${client.user.tag} ${colors.magenta}
| ~ $ > Loaded ${countJsFiles()} commands ${colors.magenta}
| ~ $ > Run /help for help ${colors.magenta}
| ~ $ > the useless webhost:) : http://localhost:53134 ${colors.magenta}
`;

        function countJsFiles() {
            const commandsPath = path.join(__dirname, '..', 'commands');
            let fileCount = 0;

            function countFiles(dirPath) {
                const files = fs.readdirSync(dirPath);

                files.forEach(file => {
                    const filePath = path.join(dirPath, file);
                    const stats = fs.statSync(filePath);

                    if (stats.isDirectory()) {
                        countFiles(filePath);
                    } else if (file.endsWith('.js')) {
                        fileCount += 1;
                    }
                });
            }

            countFiles(commandsPath);
            return fileCount;
        }

        const getTerminalSize = () => {
            return {
                columns: process.stdout.columns || 80,
                rows: process.stdout.rows || 24
            };
        };

        const centerText = (text) => {
            const { columns, rows } = getTerminalSize();
            const lines = text.split('\n');
            const maxLineLength = Math.max(...lines.map(line => line.length));
            const paddingHorizontal = Math.max(0, Math.floor((columns - maxLineLength - 40) / 2));
            const verticalPadding = Math.max(0, Math.floor((rows - lines.length) / 2));

            if (paddingHorizontal < 0) {
                console.warn('Warning: Horizontal padding is negative. Check terminal size.');
                return text;
            }

            const centeredLines = lines.map(line => ' '.repeat(paddingHorizontal) + line).join('\n');
            const finalCenteredText = '\n'.repeat(verticalPadding) + centeredLines;

            return finalCenteredText;
        };

        const printCenteredText = () => {
            const centeredText = centerText(asciiArt);
            readline.cursorTo(process.stdout, 0, 0);
            console.clear();
            console.log(centeredText);
        };

        const width = 30;
        const height = 9;
        const distanceFromCam = 100;
        const K1 = 20;
        const incrementSpeed = 0.6;
        const cubeWidth = 11;

        let A = 0, B = 0, C = 0;
        const zBuffer = new Array(width * height).fill(0);
        const buffer = new Array(width * height).fill(' ');

        const calculateX = (i, j, k) => {
            return j * Math.sin(A) * Math.sin(B) * Math.cos(C) - k * Math.cos(A) * Math.sin(B) * Math.cos(C) +
                j * Math.cos(A) * Math.sin(C) + k * Math.sin(A) * Math.sin(C) + i * Math.cos(B) * Math.cos(C);
        };

        const calculateY = (i, j, k) => {
            return j * Math.cos(A) * Math.cos(C) + k * Math.sin(A) * Math.cos(C) -
                j * Math.sin(A) * Math.sin(B) * Math.sin(C) + k * Math.cos(A) * Math.sin(B) * Math.sin(C) -
                i * Math.cos(B) * Math.sin(C);
        };

        const calculateZ = (i, j, k) => {
            return k * Math.cos(A) * Math.cos(B) - j * Math.sin(A) * Math.cos(B) + i * Math.sin(B);
        };

        const calculateForSurface = (cubeX, cubeY, cubeZ, ch) => {
            const x = calculateX(cubeX, cubeY, cubeZ);
            const y = calculateY(cubeX, cubeY, cubeZ);
            const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;

            const ooz = 1 / z;

            const xp = Math.floor(width / 2 + K1 * ooz * x * 2);
            const yp = Math.floor(height / 2 + K1 * ooz * y);

            const idx = xp + yp * width;
            if (idx >= 0 && idx < width * height) {
                if (ooz > zBuffer[idx]) {
                    zBuffer[idx] = ooz;
                    buffer[idx] = ch;
                }
            }
        };

        const printCube = () => {
            buffer.fill(' ');
            zBuffer.fill(0);

            for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
                for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
                    calculateForSurface(cubeX, cubeY, -cubeWidth, colors.red + '@' + colors.reset);
                    calculateForSurface(cubeWidth, cubeY, cubeX, colors.green + '$' + colors.reset);
                    calculateForSurface(-cubeWidth, cubeY, -cubeX, colors.blue + '~' + colors.reset);
                    calculateForSurface(-cubeX, cubeY, cubeWidth, colors.yellow + '#' + colors.reset);
                    calculateForSurface(cubeX, -cubeWidth, -cubeY, colors.magenta + ';' + colors.reset);
                    calculateForSurface(cubeX, cubeWidth, cubeY, colors.cyan + '+' + colors.reset);
                }
            }

            let output = '';
            for (let k = 0; k < width * height; k++) {
                output += (k % width === 0 ? '\n' : '') + buffer[k];
            }
            return output;
        };

        const printOutput = () => {
            const cubeOutput = printCube();
            const asciiArtLines = asciiArt.split('\n');
            const cubeLines = cubeOutput.split('\n');

            const maxLines = Math.max(asciiArtLines.length, height);
            const paddedAsciiArt = asciiArtLines.concat(new Array(maxLines - asciiArtLines.length).fill(''));
            const paddedCubeLines = cubeLines.concat(new Array(maxLines - cubeLines.length).fill(''));

            const padding = 4;
            const combinedOutput = paddedAsciiArt.map((line, index) => {
                return (line + ' '.repeat(padding) + paddedCubeLines[index]).slice(0, getTerminalSize().columns);
            }).join('\n');

            readline.cursorTo(process.stdout, 0, 0);
            console.clear();
            console.log(combinedOutput);
        };

        printCenteredText();
        printOutput();

        process.stdout.on('resize', () => {
            printCenteredText();
            printOutput();
        });

        setInterval(() => {
            A += 0.05;
            B += 0.05;
            C += 0.01;
            printOutput();
        }, 80);
    },
};
