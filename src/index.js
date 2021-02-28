// for local debug
let LOG = "";

function local_log(msg) {
    LOG += `${msg}   `;
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
            local_log(line);
            local_log("abc");
            local_log(cmd);
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

    local_log("a");
    local_log("b");

    const proc = cp.spawn('./apery', [], { cwd: '/usr/local/apery/bin/' })
    let result;
    //proc.stdin.write(createStdin());
    // proc.stdin.write('usi\n');
    // result = await getResult(proc.stdout)

    proc.stdin.write('isready\n');
    result = await getResult(proc.stdout)



    proc.kill();

    // local_log(result);

    return LOG;

    // ここが近い気がするが。。。
    // https://qiita.com/keroxp/items/0d1a271329ccc1381b1e

    // これもあり?
    // http://morakana.hatenablog.jp/entry/2018/02/28/135936
    // https://ali-dev.medium.com/how-to-use-promise-with-exec-in-node-js-a39c4d7bbf77

    // promiseについて
    // https://techplay.jp/column/581

    // 技巧のlambda化、これだけでいいの?
    // https://github.com/na-o-ys/serverless-shogi/blob/master/gikou/src/index.ts

    // exec使ってみた版1------------------
    // const proc = exec(
    //     '/usr/local/apery/bin/apery',
    //     (err, stdout, stderr)=>{
    //  local_log(stdout);
    // }
    // );

    // proc.stdin.write('usi');
    // proc.stdin.end();

    // const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await _sleep(2000);

    // return LOG;


    // exec使ってみた版2------------------
    // const result = await execShellCommand('ls -la');
    // local_log(result);
    // return LOG;



    // -------------spawn使ってみた版-----------------
    // let proc = cp.spawn('/usr/local/apery/bin/apery');
    // local_log(proc.pid);
    // proc.stderr.on('data', (err) => {  // 昨日は、data 部分が error だった
    //     local_log(err.toString());
    //     local_log('spawn Error *********');
    // })
    // proc.stdout.on('data', (data) => {
    //     local_log(data.toString());
    //     local_log('spawn Success!');
    // })
    // proc.stdin.write('usi');
    // local_log("aa");
    // const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // await _sleep(2000);
    // return LOG;
    // -----------------------------------------


    // execSync使ってみた版
    // const result =  execSync('ls -la ./');
    // let result;

    // result =  execSync('/usr/local/apery/bin/apery usi');
    // local_log(result);

    // result =  execSync('/usr/local/apery/bin/apery isready');
    // local_log(result);

    // result =  execSync('/usr/local/apery/bin/apery usinewgame');
    // local_log(result);

    // result =  execSync('/usr/local/apery/bin/apery position startpos moves 7g7f');
    // local_log(result);

    // result =  execSync('/usr/local/apery/bin/apery go');
    // local_log(result);

    // const response = {
    //     statusCode: 200,
    //     body: JSON.stringify(LOG),
    // };
    // return response;




};
