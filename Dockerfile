#Base image
FROM node:22-slim

#Set working directory in container
WORKDIR /app

#Copy dependencies
COPY package*.json ./
#Run dependencies
RUN npm install

#Copy source code
COPY . .

#Expose port
EXPOSE 2703


CMD ["npm", "start"]
