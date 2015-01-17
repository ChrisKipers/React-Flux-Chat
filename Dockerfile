FROM dockerfile/nodejs
MAINTAINER Chris Kipers

RUN apt-get update -qq

# install ruby
RUN apt-get install -y -qq ruby-dev
RUN apt-get install make

RUN gem install --no-rdoc --no-ri compass

RUN npm install -g gulp

WORKDIR /home/app
ADD package.json /home/app/package.json
RUN npm install

ADD . /home/app

RUN gulp
EXPOSE 3000
