# build environment
FROM node:11 as builder

ARG VERSION=latest
ENV REACT_APP_VERSION=${VERSION}

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY .npmrc /usr/src/app/.npmrc
RUN npm install --silent
RUN npm install -D extract-text-webpack-plugin@next
RUN npm install -D loader-utils@latest
COPY . /usr/src/app
RUN npm run build

# production environment
FROM nginx:1.13.9-alpine

RUN rm -rf /etc/nginx/conf.d
COPY conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
