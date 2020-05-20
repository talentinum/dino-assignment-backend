FROM node:10

WORKDIR /srv/app

COPY ormconfig.json package*.json tsconfig.build.json tsconfig.json wait-for-it.sh ./
RUN chmod +x wait-for-it.sh && npm ci

COPY src/ ./src
RUN npm run build

EXPOSE 8000
ENTRYPOINT npm run run:prd
