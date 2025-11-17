server {
  listen 80;

  server_name localhost;

  root /usr/share/nginx/html;

  index index.html;

  location / {
    # Try to serve file directly, if not found → send to index.html
    try_files $uri /index.html;
  }
  
}