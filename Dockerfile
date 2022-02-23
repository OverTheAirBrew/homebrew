FROM node:16

WORKDIR /

COPY ./dist ./dist
COPY package.json ./package.json
COPY node_modules ./node_modules

ENTRYPOINT [ "node" ]
CMD [ "." ]