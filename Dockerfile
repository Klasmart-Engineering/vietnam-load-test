FROM ubuntu:20.04

## Installing environment level dependencies
ENV DEBIAN_FRONTEND noninteractive
ENV APT_LISTCHANGES_FRONTEND none
RUN apt -o=Dpkg::Use-Pty=0 update
RUN apt-get -o=Dpkg::Use-Pty=0 -qqy install npm
RUN apt-get -o=Dpkg::Use-Pty=0 -qqy install curl vim wget libappindicator1 fonts-liberation
## Install Chrome
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -P /tmp
RUN apt-get -o=Dpkg::Use-Pty=0 -qqy install /tmp/google-chrome-stable_current_amd64.deb

RUN apt-get -o=Dpkg::Use-Pty=0 -qqy install xorg xvfb gtk2-engines-pixbuf dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable imagemagick x11-apps
COPY . /tmp/
WORKDIR /tmp/
RUN npm i
ENV DISPLAY ":99.0"
RUN rm -rf /var/lib/apt/lists/* && rm -f /tmp/google-chrome-stable_current_amd64.deb
ENTRYPOINT [ "./nightwatch-start.sh"]
