FROM node:lts-alpine AS development

WORKDIR /opt/pubnub-mcp

COPY package*.json ./
RUN npm install --only=development

COPY . .

RUN npm run lint
RUN npm run build

FROM node:lts-alpine AS production

ENV MCP_MODE="stdio"

WORKDIR /opt/pubnub-mcp

COPY package*.json ./
RUN npm install --only=production

COPY --from=development /opt/pubnub-mcp/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "exec node dist/index.js --${MCP_MODE}"]
