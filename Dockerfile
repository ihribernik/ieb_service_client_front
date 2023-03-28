FROM node:18-alpine as build-stage

WORKDIR /usr/app
COPY . /usr/app
RUN npm ci
RUN npm run build


FROM nginx:1.23.1-alpine
EXPOSE 80
COPY ./docker/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /usr/app/dist /usr/share/nginx/html