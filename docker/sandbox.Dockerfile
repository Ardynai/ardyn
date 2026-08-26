# ardyn-sandbox:22.04 — capable computer-use sandbox image.
#
# Stock ubuntu:22.04 cannot run ARDYN's computer-use action toolchain (no
# Xvfb, no xdotool, no ImageMagick `import`). This image adds exactly those
# pieces — nothing else. Build:
#
#   docker build -t ardyn-sandbox:22.04 -f docker/sandbox.Dockerfile .
#
# The container is still launched by packages/core/src/computer-use.mjs with
# the hardening flags (--rm --no-new-privileges --cap-drop ALL --read-only
# --tmpfs /tmp --memory 512m --cpus 1.0 --network none); this file only
# provides the missing binaries. Keep it minimal.
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       xvfb \
       x11-utils \
       xdotool \
       imagemagick \
       fonts-dejavu-core \
       ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Default lifetime command (matches what computer-use.mjs passes explicitly):
# virtual display on :99, then idle forever until docker kill/rm.
CMD ["sh", "-c", "Xvfb :99 -screen 0 1280x720x24 & sleep infinity"]
