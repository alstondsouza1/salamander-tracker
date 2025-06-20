FROM node:18-alpine

WORKDIR /app

# copy only package.json first
COPY package*.json ./
RUN npm install

# copy the rest of the Next.js app
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]