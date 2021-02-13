# AWS Docker Image
FROM amazon/aws-lambda-nodejs:12

WORKDIR /usr/local/app

# Port
EXPOSE 8000

# Application
RUN echo $'\n\
  exports.handler = async (event) => { \n\
    const response = { \n\
      statusCode: 200, \n\
      body: JSON.stringify(\'Hello from Lambda!\'), \n\
    }; \n\
    return response; \n\
  }; \n\
  ' > index.js

CMD [ "/usr/local/app/index.handler" ]