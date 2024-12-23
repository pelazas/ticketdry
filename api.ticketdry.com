
server {
   listen 80;
   server_name api.ticketdry.com; 
   # Redirect HTTP to HTTPS 
   return 301 https://$host$request_uri; 
}

server {
    listen 443 ssl;
    server_name api.ticketdry.com;
    ssl_certificate /etc/letsencrypt/live/api.ticketdry.com/fullchain.pem;  # Certificado SSL
    ssl_certificate_key /etc/letsencrypt/live/api.ticketdry.com/privkey.pem;  # Clave privada SSL
    location / {
        proxy_pass http://localhost:8000;  # Puerto donde corre tu aplicación Express
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
server {
    listen 27017;  # Listen on port 27017 for MongoDB traffic
    server_name api.ticketdry.com;
    location / {
        proxy_pass http://localhost:27017;  # Forward MongoDB requests to localhost:27017
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

