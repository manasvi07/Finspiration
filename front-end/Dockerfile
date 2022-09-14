FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY build build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
