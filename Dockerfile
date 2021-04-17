# AWS Docker Image
FROM amazon/aws-lambda-nodejs:14

# Port
EXPOSE 8000

WORKDIR /usr/local

RUN yum install git -y     && \
    yum install make -y    && \
    yum install clang -y   && \
    yum install tar -y     && \
    # Yaneuraou
    curl -LO https://github.com/mizar/YaneuraOu/archive/v6.0.0.tar.gz && \
    tar -zxvf v6.0.0.tar.gz && \
    cd /usr/local/YaneuraOu-6.0.0/source &&\
    make clean tournament TARGET_CPU=AVX2 YANEURAOU_EDITION=YANEURAOU_ENGINE_NNUE && \
    mkdir -p /mnt/bin && \
    mkdir -p /mnt/bin/eval
#   mv /usr/local/YaneuraOu-6.0.0/source/YaneuraOu-by-gcc /mnt/bin

# eval
# WORKDIR /usr/local/YaneuraOu-6.0.0/bin/eval
# COPY eval/suisyo3kai_20210111/nn.bin .

# lambda Application
WORKDIR /usr/local/app
COPY src/ .
RUN npm install

CMD [ "/usr/local/app/index.handler" ]