# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Set environment variables (Replace with Clever Cloud MySQL credentials)
ENV DATABASE_URL="mysql://uqwyjsbuhrlrac3z:R09PlVnu1g53YaUYu1CH@b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com:3306/b8vtcotaqmvgtuxs8nep"
ENV NEXTAUTH_URL="https://your-vercel-app.vercel.app/"
ENV NEXT_PUBLIC_API_URL="https://your-backend.clever-cloud.com/api"

# Build the Next.js app
RUN npm run build

# Expose frontend port
EXPOSE 3000

# Start the frontend app
CMD ["npm", "run", "start"]
