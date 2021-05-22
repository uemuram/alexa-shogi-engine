// 定数定義
const cp = require("child_process");

// for local debug
let LOG = "";

function local_log(msg) {
    LOG += `${msg}   `;
}

function log(msg) {
    // local_log(msg);
    // cp.execSync(`echo "${msg}" >> /tmp/log.txt`);
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

    // コールドスタート対策
    if (event.warming) {
        log('warming...')
        return {
            statusCode: 200,
            body: 'success',
        };
    }

    log("engine start");

    // 引数から設定取得
    log(`mode : ${event.mode}`);
    log(`key : ${event.key}`);
    log(`moves : ${event.moves}`);
    const mode = event.mode;
    const key = event.key;


    let result;
    let responseBody = {};
    if (mode == 'search') {
        // 手を考えるモード

        // 現在の盤面
        const moves = event.moves.join(' ');

        // 環境変数から設定取得
        // ハッシュ
        const usiHash = process.env['USI_HASH'] || 1024;
        log(`usiHash : ${usiHash}`);
        // 制限時間
        const byoyomi = process.env['BYOYOMI'] || 3000;
        log(`byoyomi : ${byoyomi}`);

        // エンジン呼び出し
        // コンテナから取り出された実行ファイルがEFSに置かれており、lambdaにマウントされている前提。
        const proc = cp.spawn('./YaneuraOu-by-gcc', [], { cwd: '/mnt/bin/' });
        proc.stdin.write('setoption name USI_Ponder value false\n');
        proc.stdin.write(`setoption name USI_Hash value ${usiHash}\n`);
        proc.stdin.write('isready\n');
        proc.stdin.write('usinewgame\n');
        proc.stdin.write(`position startpos moves ${moves}\n`);
        proc.stdin.write(`go btime 0 wtime 0 byoyomi ${byoyomi}\n`);
        log("waiting...");

        result = await getResult(proc.stdout);
        log(`bestmove : ${result}`);
        proc.kill();

        responseBody.bestmove = result;

        // キーが指定されていた場合は結果を保存する
        if (key) {
            console.log('結果保存');
            let saveJson = {
                'responseBody': responseBody,
                'status': 'success'
            };
            saveJson = JSON.stringify(saveJson);
            const saveCommand = `echo '${saveJson}' > /mnt/bin/result/${key}.json`;
            console.log(`save command : ${saveCommand}`);
            cp.execSync(saveCommand);
        }
    }
    else {
        // 保存された結果を取り出す
        if (!key) {
            throw new Error('key is required');
        }
        // 結果ファイルがあるかチェック
        const checkCommand = `ls /mnt/bin/result/${key}.json | wc -l`;
        console.log(`check command : ${checkCommand}`);
        const l = cp.execSync(checkCommand);
        console.log(`file num : ${l}`);
        
        // ファイルがない場合はエラーを返す
        if(Number(l) != 1){
            return {
                statusCode: 200,
                body: JSON.stringify({"message" : "result file not found"}),
            }
        }

        // ファイルがある場合は内容を取得
        const loadCommand = `cat /mnt/bin/result/${key}.json`;
        console.log(`load command : ${loadCommand}`);
        const r = cp.execSync(loadCommand);
        console.log(`loadJson : ${r}`)
        const loadJson = JSON.parse(r);

        // 成功していない場合はエラーを返す
        if(loadJson.status != 'success'){
            return {
                statusCode: 200,
                body: JSON.stringify({"message" : "no result yet"}),
            }
        }
        responseBody = loadJson.responseBody;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

    log('engine end');
    // return LOG;
    return response;
};
