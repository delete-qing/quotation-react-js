FROM registry.cn-hangzhou.aliyuncs.com/maikeos/runtime-env-node:16.13.0 as builder

WORKDIR /var/www/html

COPY . /var/www/html

RUN yarn && yarn build

FROM registry.cn-hangzhou.aliyuncs.com/maikeos/runtime-env-nginx:1.19.9 as prod

WORKDIR /var/www/html

COPY --from=0 /var/www/html/dist .
COPY ./rush-b.sh .
COPY ./nginx.conf /usr/local/nginx-1.19.9/conf.d

EXPOSE 80

CMD ["/var/www/html/rush-b.sh && /usr/local/sbin/nginx -g \"daemon off;\""]
