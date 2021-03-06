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


let counter = 0;

function getResult(stdout) {
    return new Promise(resolve => {
        stdout.on('data', data => {
            counter ++;
            log(counter);
            // log(data.toString());
            resolve(`success(${counter})`);
        })
    })
}

exports.handler = async(event) => {
    const proc = cp.spawn('./apery', [], { cwd: '/usr/local/apery/bin/' })
    let result;

    log("start");

    proc.stdin.write('usi\n');
    result = await getResult(proc.stdout);
    log(result);

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout);
    log(result);

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout);
    log(result);

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout);
    log(result);

    proc.kill();

    log('engine end');
    return LOG;
};
