FROM dockerfile/nodejs
MAINTAINER Chris Kipers

RUN npm install -g gulp

WORKDIR /home/app
ADD package.json /home/app/package.json
RUN npm install

ADD . /home/app

RUN gulp
EXPOSE 3000
