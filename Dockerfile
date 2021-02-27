# AWS Docker Image
FROM amazon/aws-lambda-nodejs:12

# Port
EXPOSE 8000

# middleware
RUN yum install git -y
RUN yum install make -y
RUN yum install gcc-c++ -y

# Apery
WORKDIR /usr/local
RUN git clone https://github.com/HiraokaTakuya/apery.git
WORKDIR /usr/local/apery/src
RUN make
RUN cp /usr/local/apery/src/apery /usr/local/apery/bin

# lambda Application
WORKDIR /usr/local/app
COPY src/ .

CMD [ "/usr/local/app/index.handler" ]