FROM node:16 as base

ARG APP=homebrew
ENV CI=true

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./tsconfig.json ./
COPY ./lerna.json ./

COPY ./apps/${APP} ./apps/${APP}
COPY ./packages ./packages

RUN npm ci --ignore-scripts --omit=optional
RUN npm run bootstrap -- -- --omit=optional

RUN npm run build
RUN npm run convert-symlinks

FROM node:16

ARG APP=homebrew

ENV NODE_ENV=production
ENV HOME_DIR=/homebrew/data

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1

EXPOSE 3000
VOLUME [ "/homebrew/data" ]

WORKDIR /app

COPY --chown=node --from=base /app/apps/${APP}/dist ./apps/${APP}/dist
COPY --chown=node --from=base /app/apps/${APP}/package.json ./apps/${APP}/package.json
COPY --chown=node --from=base /app/apps/${APP}/node_modules ./apps/${APP}/node_modules

WORKDIR /app/apps/${APP}

CMD ["node",  "." ]