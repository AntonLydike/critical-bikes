#/bin/bash
# builds you a damn fine CriticalBike release
# uses docker so that you don't have to install npm

set -eu

# please run with docker access rights (probably sudo)

declare -A flags

flags["sqlusr"]='criticalmass'
flags["sqlpw"]='password'
flags["sqldb"]='criticalmass'
flags["sqlhost"]='localhost'
flags["mode"]='PROD'

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

echo "loaded config is:"
declare -p flags

if [ "${flags[sqlpw]}" == "password" ]; then
  echo "Are you sure you db password should be password? configure it with the --sqlpw option! (press enter to continue)"
  read nothing
fi

# remove container if it exists
if [ "$(docker ps -a | grep critm_dummy)" ]; then
  docker container rm critm_dummy
fi

docker build -f builder.Dockerfile --build-arg sqlusr="${flags[sqlusr]}" --build-arg sqlpw="${flags[sqlpw]}" --build-arg sqldb="${flags[sqldb]}" --build-arg sqlhost="${flags[sqlhost]}" --build-arg mode="${flags[mode]}" -t critm_builder .

docker container create -ti --name critm_dummy critm_builder bash

docker cp critm_dummy:/criticalbike.tar.gz criticalbike.tar.gz

docker container rm critm_dummy
