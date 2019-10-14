# this docker container is used to build the final product
FROM ubuntu:bionic

RUN apt-get update; apt-get install -y npm tar curl

RUN mkdir /build; cd /build; npm init -y; npm install -g @babel/core @babel/cli; npm install @babel/core @babel/preset-env @babel/plugin-transform-regenerator @babel/polyfill babel-preset-minify --save-dev

ADD . /build

# database config
ARG sqlusr=criticalmass
ARG sqlpw=password
ARG sqldb=criticalmass
ARG sqlhost=localhost
ARG mode=PROD
ARG contact=anonymous

# set production mode
ENV MODE=$mode

RUN cd /build; chmod +x config.sh; ./config.sh "$sqlusr" "$sqlpw" "$sqldb" "$sqlhost" "$contact"
