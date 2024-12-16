FROM node
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3002
CMD ["npm","start"]