FROM ubuntu:20.04

## Installing environment level dependencies
RUN apt update
RUN DEBIAN_FRONTEND=noninteractive apt install npm -y
RUN apt install curl vim wget libappindicator1 fonts-liberation -y
## Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P /tmp
RUN apt install /tmp/google-chrome-stable_current_amd64.deb -y

RUN apt-get -y install xorg xvfb gtk2-engines-pixbuf dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable imagemagick x11-apps
COPY . /tmp/
WORKDIR /tmp/
RUN npm i
ENV DISPLAY ":99.0"
RUN rm -rf /var/lib/apt/lists/* && rm -f /tmp/google-chrome-stable_current_amd64.deb
ENTRYPOINT [ "./nightwatch-start.sh"]
