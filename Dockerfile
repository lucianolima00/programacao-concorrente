FROM dmstr/php-yii2:latest-nginx

COPY . /app

WORKDIR /app

CMD bash -c "cp default.txt /etc/nginx/conf.d/default.conf"