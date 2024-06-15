FROM nginx:1.25.4
EXPOSE 80 41738

#タイムゾーン設定
ENV TZ=Asia/Tokyo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt update && DEBIAN_FRONTEND=noninteractive apt install -y tzdata

# 基本インストール
RUN apt update && apt upgrade -y
RUN apt install python3-dev python3-pip -y
##############################################################################
#アプリケーション設定
WORKDIR /usr/local/reflection
RUN mkdir ./data

#html client
WORKDIR /var/www/html/reflection
COPY ./image_resources/client/ ./

#app server working dir
WORKDIR /usr/local/reflection/servers

#server src copy
COPY ./src/server ./
RUN pip3 install --break-system-packages  -r ./requirements.txt

##############################################################################
#nginx設定のコピー
COPY  ./image_resources/nginx.conf /etc/nginx/

