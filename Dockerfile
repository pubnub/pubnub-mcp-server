FROM node:24.22.1-alpine AS development

ARG AMPLITUDE_API_KEY=""
ENV AMPLITUDE_API_KEY=$AMPLITUDE_API_KEY

RUN npm install -g npm@^11.18.0

WORKDIR /opt/pubnub-mcp

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run lint
RUN npm run build

FROM node:24.22.1-alpine AS production

ENV MCP_MODE="stdio"

WORKDIR /opt/pubnub-mcp

COPY package*.json ./
RUN npm install --only=production && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY --from=development /opt/pubnub-mcp/dist ./dist

EXPOSE 3000

USER node

CMD ["sh", "-c", "exec node dist/index.js --${MCP_MODE}"]
