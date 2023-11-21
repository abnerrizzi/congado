#!/bin/bash

convert_to_utf8() {
  local file="$1"
  local encoding=$(file -b --mime-encoding "$file")

  if [ "$encoding" != "utf-8" ]; then
    echo "Converting $file from $encoding to UTF-8"
    iconv -f "$encoding" -t utf-8 "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

remove_carriage_returns() {
  local file="$1"

  if grep -q $'\r$' "$file"; then
    echo "Removing ^M characters from $file"
    tr -d '\r' < "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

process_directory() {
  local directory="$1"
  local files=$(find "$directory" -type f)

  for file in $files; do
    convert_to_utf8 "$file"
    remove_carriage_returns "$file"
  done
}

main() {
  # Check if a directory is provided
  if [ -z "$1" ]; then
    echo "Usage: $0 <directory>"
    exit 1
  fi

  local directory="$1"

  # Check if the directory exists
  if [ ! -d "$directory" ]; then
    echo "Error: Directory not found."
    exit 1
  fi

  process_directory "$directory"

  echo "Conversion and ^M removal complete."
}

# Run the main function with the provided directory argument
main "$@"

