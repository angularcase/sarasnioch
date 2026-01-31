docker run -d --name postgres \
  -e POSTGRES_DB=sarasnioch \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine