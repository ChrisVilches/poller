#!/bin/bash

FILE_RAW=db-seed.json
FILE_ENC=scripts/db-seed.json.encrypted

echo "Note:"
echo "Encryption expects $FILE_RAW to exist (it's Git ignored)."
echo "Decryption creates that file (from $FILE_ENC)."
echo "Edit $FILE_RAW, then encrypt again."
echo
echo "./encrypt.sh -d   # decrypt"
echo "./encrypt.sh      # encrypt"
echo

FLAGS="-aes-256-cbc -md sha512 -pbkdf2 -salt -iter 100000"

if [[ $* == *-d* ]]
then
  openssl enc -d $FLAGS -in $FILE_ENC -out $FILE_RAW
else
  openssl enc $FLAGS -in $FILE_RAW -out $FILE_ENC
fi

