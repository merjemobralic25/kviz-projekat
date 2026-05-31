# Koristimo alpine verziju Node-a radi manje velicine image-a
FROM node:18-alpine

WORKDIR /app

# Prvo kopiramo package fajlove i instaliramo zavisnosti
COPY package*.json ./
RUN npm install --production

# Kopiranje ostatka projekta
COPY . .

# Kreiranje foldera za bazu (db.json)
RUN mkdir -p /app/data && cp db.json /app/data/db.json

EXPOSE 3001

# Pokretanje json-servera na portu 3001
CMD ["npx", "json-server", "--watch", "/app/data/db.json", "--port", "3001", "--host", "0.0.0.0"]