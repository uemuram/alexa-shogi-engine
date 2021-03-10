// 定数定義
const cp = require("child_process");

// for local debug
let LOG = "";

function local_log(msg) {
    LOG += `${msg}   `;
}

function log(msg) {
    local_log(msg);
    cp.execSync(`echo "${msg}" >> /tmp/log.txt`);
    console.log(msg);
}

function getResult(stdout) {
    return new Promise(resolve => {
        stdout.on('data', data => {
            const dataStr = data.toString();
            log(dataStr);
            // 1度に複数行出力される場合があるので改行で分割
            const lines = dataStr.split("\n")

            for (let i = 0; i < lines.length; i++) {
                let words = lines[i].split(" ");
                // 最善手が返ってきた場合、その内容を返す
                if (words[0] == 'bestmove') {
                    resolve(words[1]);
                }
            }
        })
    })
}

exports.handler = async(event) => {
    const proc = cp.spawn('./target/release/apery', [], { cwd: '/usr/local/apery_rust/' })
    let result;

    log("engine start");
    log(`move : ${event.moves}`);

    // ここまでの手順
    const moves = event.moves.join(' ');

    proc.stdin.write('setoption name USI_Ponder value false\n');
    proc.stdin.write('setoption name USI_Hash value 1024\n');
    proc.stdin.write('isready\n');
    proc.stdin.write('usinewgame\n');
    proc.stdin.write(`position startpos moves ${moves}\n`);
    proc.stdin.write('go btime 0 wtime 0 byoyomi 3000\n');
    result = await getResult(proc.stdout);
    log(`bestmove : ${result}`);

    proc.kill();

    const responseBody = {
        bestmove: result
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

    log('engine end');
    // return LOG;
    return response;
};
