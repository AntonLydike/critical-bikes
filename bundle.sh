#!/usr/bin/env bash

# this bundles the frontend files

set -eu

log=".build.log"
main_html="index.html"

if [ -f "$log" ]; then
  rm "$log";
fi

declare -A flags

flags["log"]=false
flags["cache"]=".cache"
flags["disable-cache"]=false
flags["production"]=false
flags["watch"]=false

# run in production mode when
if [ "${MODE:-}" == 'PROD' ]; then
  echo "Detected production environment, --production defaults to true!";
  flags["production"]=true
fi

# parse flags in the format of --key=value and -abc (as a, b, and c = true)
for arg in "$@"; do
  # if we have a --key=value argument
  if [[ "$arg" =~ ^-- ]]; then
    arg="${arg:2}"
    # if arg contains an "=", use the value behind it
    if [[ "$arg" =~ '=' ]]; then
      key="${arg%%=*}"
      val="${arg#*=}"
      flags[$key]="$val"
    # handle --key (implicit --key=true)
    else
      flags[$arg]=true
    fi
  # if we have a -abc arguments
  elif [[ "$arg" =~ ^- ]]; then
    arg="${arg:1}"
    # iterate over all of them
    for (( i=0; i<${#arg}; i++ )); do
      flags[${arg:$i:1}]=true
    done
  fi
done


# when building for production, some flags are set to fixed values
if [ "${flags[production]}" == true ]; then
  flags["watch"]=false
  flags["disable-cache"]=true

  if [ "${MODE:-}" != 'PROD' ]; then
    echo "[WARNING] running build script with PROD flag, but having environment set to DEV!";
  else
    echo "Running in production mode..."
  fi
fi

# create cache directory
if [ ! -d "${flags[cache]}" ]; then
  mkdir "${flags[cache]}";
fi

# compiling all components, logging logs etc
function main {
  echo "building..."

  # a list of all compile tasks
  compile src/main.js main.build.js
  compile src/css/main.css main.build.css

  if [ "${flags[log]}" == true ]; then
    cat $log
    rm $log
  fi

  # if building for production, remove source folders, cache, build.sh
  if [ "${flags[production]}" == true ]; then
    rm -r src;
    rm -r "${flags[cache]}"
  fi
}



# compile file $1 to target file $2
function compile {
  log_to_file "Reading file $1"
  content=$(read_file "$1")

  echo "$content" > "$2"

  # calculate sha1 hash of generated content
  hash=$(echo -n "$content" | shasum | cut -f1 -d " ")

  # append cachebuster to content
  sed -r -i "s/$2(\?v=[[:alnum:]]*)?/$2?v=$hash/g" "$main_html"
}

# read file $1 line for line, executing all compiler instructions
function read_file {
  if [ ! -f "$1" ]; then
    echo "FILE NOT FOUND!!!";
    log_to_file "File $1 not found!!!"
    return 1;
  fi

  old_IFS=$IFS
  IFS=""
  while read -r line; do
    if [ "${line:0:1}" == '@' ]; then
      cmd="${line:1}"
      IFS=${old_IFS}
      exec_cmd "$1" "$cmd"
      IFS=""
    else
      echo "$line"
    fi
  done < "$1";
  IFS=${old_IFS}
}

# execute compiler command $2 in file $1, results are echoed
function exec_cmd {
  cmd=${2%% *}
  args=${2#* }
  case "$cmd" in
    "include")
      log_to_file "running $cmd with $args"
      cmd_include "$1" "$args"
      return 0
      ;;
    "download")
      log_to_file "running $cmd with $args"
      cmd_download "$1" "$args"
      return 0
    esac
    log_to_file "unknown cmd: \"$cmd\""
    echo @$2
}

# include $2... into file $1
function cmd_include {
  # get directory of file we are currently including into
  base=$(dirname "$1")
  # strip quotationmarks from path
  target=$(echo "$2" | xargs)
  # assemble path
  path="$base/$target"

  # if we don't have a single file given, run a search, sort and then include them all
  if [[ "${target: -1}" =~ ^[*/]$ ]]; then
    # iterate over files, sorted alphabetically (with underscores first as denoted by LC_COLLATE=C)
    for file in $(find $path -not -path '*/\.*' -not -iname '*.import.*' -type f | env LC_COLLATE=C sort); do
      read_file "$file"
      echo
    done
  else
    # include the single file
    log_to_file "direct include used for file $target"
    read_file "$path";
  fi
}

# download source from url $2
function cmd_download {
  url=$(echo "$2" | xargs)

  # if we don't use the cache, we can just skip all that underneath
  if [ "${flags[disable-cache]}" == true ]; then
    curl -L --silent "$url"
    return 0
  fi

  # calculate hash of url
  hash=$(echo -n "$url" | shasum | cut -f1 -d " ")

  # check if file is missing in cache
  if [ ! -f "${flags[cache]}/$hash.url" ]; then
    # download it, write it to cache
    log_to_file "cache miss for $url, downloading"
    content=$(curl -L --silent "$url")
    echo "$content" > "${flags[cache]}/$hash.url"
    echo "$content"
  else
    # if we have a cache hit, use it
    log_to_file "cache hit for $url, using local version"
    cat "${flags[cache]}/$hash.url"
  fi
}

function log_to_file {
  if [ "${flags[log]}" == true ]; then
    echo "$1" >> "$log";
  fi
}

if [ "${flags[watch]}" == true ]; then
  while true; do
    inotifywait -q -r -e modify,move,create,delete --exclude '(build\.|\.cache|api|\.git|\.html)' .
    main
  done
else
  main
fi
