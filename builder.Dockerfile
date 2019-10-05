# this docker container is used to build the final product
FROM ubuntu:bionic

RUN apt-get update; apt-get install -y npm tar

RUN npm init -y; npm install -g @babel/core @babel/cli babel-minify; npm install @babel/preset-env babel-minify

COPY . /build

# database config
ARG sqlusr=criticalmass
ARG sqlpw=password
ARG sqldb=criticalmass
ARG sqlhost=localhost
ARG mode=PROD

# set production mode
ENV MODE=$mode

RUN cd /build; chmod +x config.sh; ./config.sh $sqlusr $sqlpw $sqldb $sqlhost
