# Prva faza: Build aplikacije
FROM node:18-alpine AS builder

WORKDIR /app

# Instalacija paketa
COPY package*.json ./
RUN npm ci --silent

# Kopiranje koda i kreiranje produkcijske verzije
COPY . .

ARG REACT_APP_API_URL=http://localhost:3001
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# Druga faza: Pokretanje preko Nginx-a
FROM nginx:alpine

# Kopiranje kreiranje fajlova iz prve faze
COPY --from=builder /app/build /usr/share/nginx/html

# Ubacivanje nase nginx konfiguracije za React ruter
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]