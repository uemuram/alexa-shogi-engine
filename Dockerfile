# AWS Docker Image
FROM amazon/aws-lambda-nodejs:14

# Port
EXPOSE 8000

# lambda Application
WORKDIR /usr/local/app
COPY src/ .
RUN npm install && \
    mkdir -p /mnt/bin 

CMD [ "/usr/local/app/index.handler" ]