# AWS Docker Image
FROM amazon/aws-lambda-nodejs:12

# Port
EXPOSE 8000

WORKDIR /usr/local

RUN yum install git -y     && \
    yum install make -y    && \
    yum install gcc-c++ -y && \
    yum clean all          && \
    # Apery
    git clone https://github.com/HiraokaTakuya/apery.git && \
    cd /usr/local/apery/src && \
    make && \
    cp /usr/local/apery/src/apery /usr/local/apery/bin

# lambda Application
WORKDIR /usr/local/app
COPY src/ .
RUN npm install

CMD [ "/usr/local/app/index.handler" ]