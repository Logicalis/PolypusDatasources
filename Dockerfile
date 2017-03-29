FROM node:6.9.4

LABEL maintainer "Bruno Orlandi"

ENV NODE_ENV "production"
ENV PORT "4000"
ENV MONGODB_URL ""
ENV LOGGER_DIR ""
ENV LOGGER_LEVEL "DEBUG"

# RUN mkdir -p /opt/polypus/
WORKDIR /opt/polypus/
COPY *.js ./
COPY adapters/ ./adapters
COPY api/ ./api
COPY lib/ ./lib
COPY package.json ./

COPY config/ ./config
COPY config/polypus.yml /etc/polypus/polypus.yml


RUN npm install

EXPOSE 4000

CMD npm start