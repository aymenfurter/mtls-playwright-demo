#!/bin/bash

mkdir -p certs
openssl req -x509 -newkey rsa:4096 -keyout certs/ca.key -out certs/ca.crt -days 365 -nodes -subj "/CN=mTLS Demo CA"
openssl req -newkey rsa:4096 -keyout certs/server.key -out certs/server.csr -nodes -subj "/CN=localhost"
openssl x509 -req -in certs/server.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/server.crt -days 365
openssl req -newkey rsa:4096 -keyout certs/client.key -out certs/client.csr -nodes -subj "/CN=mTLS Demo Client"
openssl x509 -req -in certs/client.csr -CA certs/ca.crt -CAkey certs/ca.key -CAcreateserial -out certs/client.crt -days 365
rm certs/server.csr certs/client.csr
cp certs/ca.crt certs/server.crt certs/server.key api-server/certs/
cp certs/ca.crt certs/client.crt certs/client.key tests/certs/
echo "Certificates generated successfully!"