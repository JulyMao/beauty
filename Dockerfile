FROM registry.cn-hangzhou.aliyuncs.com/aliyun-node/alinode:4.6.1

RUN RUN sed -i 's/deb.debian.org/mirrors.aliyun.com/g' /etc/apt/sources.list ;mkdir -p /home/apiserver

WORKDIR /home/apiserver

COPY package.json /home/apiserver

RUN yarn --registry=https://registry.npm.taobao.org

COPY . /home/apiserver

EXPOSE 7001

ENV TZ = Asia/Shanghai

CMD npm start
