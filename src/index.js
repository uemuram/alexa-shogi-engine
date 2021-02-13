exports.handler = async(event) => {

    console.log('engine start');

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!!'),
    };

    return response;
};
