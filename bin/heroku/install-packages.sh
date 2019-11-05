#!/bin/sh

export IFS=","

for plugin in $INSTALL_PLUGINS; do
  yarn add $plugin
done

for adpack in $ADDITIONAL_PACKAGES; do
  yarn add -D $adpack
done
