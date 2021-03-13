# AWS Docker Image
FROM amazon/aws-lambda-nodejs:12

# Port
EXPOSE 8000

WORKDIR /usr/local

RUN yum install git -y && \
    yum install gcc -y && \
    yum clean all && \
    # Rust
    curl -L https://sh.rustup.rs > /tmp/rustup-init.sh && \
    chmod u+x /tmp/rustup-init.sh && \
    /tmp/rustup-init.sh -y && \
    source ~/.cargo/env && \
    # Apery
    git clone https://github.com/HiraokaTakuya/apery_rust.git && \
    cd ./apery_rust/ && \
    git submodule init && \
    git submodule update && \
    cargo build --release

# lambda Application
WORKDIR /usr/local/app
COPY src/ .
RUN npm install

CMD [ "/usr/local/app/index.handler" ]