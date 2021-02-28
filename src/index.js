// for local debug
let LOG = "";

function local_log(msg) {
    LOG += `${msg}   `;
}

function log(msg) {
    local_log(msg);
    console.log(msg);
}

const cp = require("child_process");
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
// const split = require('split');

function execShellCommand(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

function createStdin() {
    //     return `usi
    // isready
    // usinewgame
    // `
    return `usi isready
usinewgame
`
}

function getResult(stdout) {
    // let infoList = []
    // const generateResult = bestmove => ({
    //     bestmove,
    //     bestpv: selectBestPv(infoList),
    //     info_list: infoList
    // })
    return new Promise(resolve => {
        // stdout.pipe(split()).on('data', data => {
        stdout.on('data', data => {
            const line = data.toString();
            const [cmd, ...words] = line.split(" ");
            log(line);
            log("abc");
            log(cmd);
            // local_log(words);
            // if(cmd == "readyok") resolve("xyz2");
            resolve("xyz2");
            // if (cmd == "info") infoList.push(parseInfo(words))
            // if (cmd == "bestmove") resolve(generateResult(words[0]))
        })
    })
}

exports.handler = async(event) => {

    console.log('engine start');

    log("a");
    log("b");

    const proc = cp.spawn('./apery', [], { cwd: '/usr/local/apery/bin/' })
    let result;
    //proc.stdin.write(createStdin());
    // proc.stdin.write('usi\n');
    // result = await getResult(proc.stdout)

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout)



    proc.kill();


    return LOG;






};
