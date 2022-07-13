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

FROM node:16

ARG APP=homebrew

ENV NODE_ENV=production
ENV HOME_DIR=/homebrew/data

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl --fail http://localhost:3000/health || exit 1

EXPOSE 3000
VOLUME [ "/homebrew/data" ]

WORKDIR /app

COPY --chown=node --from=base /app/package.json ./package.json
COPY --chown=node --from=base /app/node_modules ./node_modules

COPY --chown=node --from=base /app/apps/${APP}/dist ./apps/${APP}/dist
COPY --chown=node --from=base /app/apps/${APP}/package.json ./apps/${APP}/package.json
COPY --chown=node --from=base /app/apps/${APP}/node_modules ./apps/${APP}/node_modules

COPY --chown=node --from=base /app/packages/shared/dist ./packages/shared/dist
COPY --chown=node --from=base /app/packages/shared/package.json ./packages/shared/package.json
# COPY --chown=node --from=base /app/packages/shared/node_modules ./packages/shared/node_modules

COPY --chown=node --from=base /app/packages/caching/dist ./packages/caching/dist
COPY --chown=node --from=base /app/packages/caching/package.json ./packages/caching/package.json
COPY --chown=node --from=base /app/packages/caching/node_modules ./packages/caching/node_modules

COPY --chown=node --from=base /app/packages/one-wire-sensor/dist ./packages/one-wire-sensor/dist
COPY --chown=node --from=base /app/packages/one-wire-sensor/package.json ./packages/one-wire-sensor/package.json
COPY --chown=node --from=base /app/packages/one-wire-sensor/node_modules ./packages/one-wire-sensor/node_modules

COPY --chown=node --from=base /app/packages/locking/dist ./packages/locking/dist
COPY --chown=node --from=base /app/packages/locking/package.json ./packages/locking/package.json
COPY --chown=node --from=base /app/packages/locking/node_modules ./packages/locking/node_modules

WORKDIR /app/apps/${APP}

CMD ["node",  "." ]