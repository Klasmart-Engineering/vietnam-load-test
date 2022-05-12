FROM ubuntu:20.04

## Installing environment level dependencies
ENV DEBIAN_FRONTEND noninteractive
ENV APT_LISTCHANGES_FRONTEND none
RUN apt update
RUN apt-get -o=Dpkg::Use-Pty=0 -qq -y install npm curl vim wget libappindicator1 fonts-liberation &> /dev/null
## Install Chrome
RUN wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P /tmp
RUN apt-get -o=Dpkg::Use-Pty=0 -qq -y install /tmp/google-chrome-stable_current_amd64.deb

RUN apt-get -o=Dpkg::Use-Pty=0 -qq -y install xorg xvfb gtk2-engines-pixbuf dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable imagemagick x11-apps &> /dev/null
RUN mkdir -p /mnt/nightwatchjs/
COPY . /mnt/nightwatchjs/
WORKDIR /mnt/nightwatchjs/
RUN npm i
ENV DISPLAY ":99.0"
RUN rm -rf /var/lib/apt/lists/* && rm -f /tmp/google-chrome-stable_current_amd64.deb
ENTRYPOINT [ "./nightwatch-start.sh"]
