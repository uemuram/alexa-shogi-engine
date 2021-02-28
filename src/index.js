// 定数定義
const cp = require("child_process");

// for local debug
let LOG = "";

function local_log(msg) {
    LOG += `${msg}   `;
}

function log(msg) {
    local_log(msg);
    console.log(msg);
}


// ロジック類
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
            log(`[cmd: ${cmd}]`);
            log(`[line: ${line}]`);
            // local_log(words);
            // if(cmd == "readyok") resolve("xyz2");
            resolve("xyz2");
            // if (cmd == "info") infoList.push(parseInfo(words))
            // if (cmd == "bestmove") resolve(generateResult(words[0]))
        })
    })
}

exports.handler = async(event) => {

    log('engine start');

    log("a");

    const proc = cp.spawn('./apery', [], { cwd: '/usr/local/apery/bin/' })
    let result;

    log("b");

    log(JSON.stringify(proc.stdout));

    proc.stdin.write('usi\n');
    result = await getResult(proc.stdout);

    log("c");

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout);

    log("d");

    // proc.stdin.write('isready\n');
    // result = await getResult(proc.stdout);

    // log("e");


    proc.kill();

    log('engine end');
    return LOG;
};
