#
# combined image - frontend and backend in one
#
FROM ubuntu:bionic

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update; apt-get install -y apache2 php7.2 libapache2-mod-php7.2 php7.2-bcmath php7.2-mysql php7.2-mbstring mysql-server

RUN ls -alf /var/www

RUN a2enmod rewrite

# COPY . /var/www/example.com/public_html

# RUN cd /var/www/example.com/public_html; ./build.sh --log; rm -r src build.sh Dockerfile .git .gitignore .cache start.sh

COPY start.sh /

RUN chmod +x /start.sh

CMD /start.sh
