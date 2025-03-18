# Use Node.js 18 as the base image
FROM node:18

# Accept build arguments (with defaults)
ARG DATABASE_URL="mysql://uqwyjsbuhrlrac3z:R09PlVnu1g53YaUYu1CH@b8vtcotaqmvgtuxs8nep-mysql.services.clever-cloud.com:3306/b8vtcotaqmvgtuxs8nep"
ARG NEXTAUTH_URL="https://frontend-service-511914647313.us-central1.run.app"
ARG NEXTAUTH_URL_INTERNAL="https://frontend-service-511914647313.us-central1.run.app"
ARG EMAIL_FROM="wheybetter@zohomailcloud.ca"
ARG EMAIL_SERVER="smtp.zohocloud.ca"
ARG EMAIL_PORT="587"  # Use 465 if you want SSL
ARG EMAIL_USER="wheybetter@zohomailcloud.ca"
ARG EMAIL_PASSWORD="gBAhDYRuv7zK"  # Replace this with the correct Zoho-generated app password
ARG NEXT_PUBLIC_API_URL="https://backend-image-i6hjrqpaca-uc.a.run.app"
ARG NEXTAUTH_SECRET="default-secret"  # Replace "default-secret" with a secure value in production

# Set the build-time environment variables so Next.js picks them up during build
ENV DATABASE_URL=${DATABASE_URL} \
    NEXTAUTH_URL=${NEXTAUTH_URL} \
    NEXTAUTH_URL_INTERNAL=${NEXTAUTH_URL_INTERNAL} \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID} \
    GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET} \
    NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Generate the Prisma Client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
