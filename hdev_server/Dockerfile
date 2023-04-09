FROM node:16
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 5000
CMD [ "node", "dist/main.js" ]