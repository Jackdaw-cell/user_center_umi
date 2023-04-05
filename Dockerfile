# 基础镜像
FROM  nginx

# 指定路径
WORKDIR /usr/share/nginx/html/
USER root
# 复制jar文件到路径
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist /usr/share/nginx/html/

EXPOSE 80

# 启动网关服务
CMD["nginx","-g","daemon off;"]
