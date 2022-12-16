#!/bin/bash

# export and split the `dev` application to target directories

echo "> cleaning dev application"
rm -Rf dev/node_modules
rm -Rf dev/.build
rm -Rf dev/.data
rm -Rf dev/package-lock.json

# ------------------------------------------------------------

echo "> copy dev into app-templates"

dest="app-templates/default"
# clean dest
rm -Rf $dest
# copy dev to dest
cp -R dev $dest

echo "  + override application.json"
cp "app-templates/application.template.json" "${dest}/config/application.json"

# ------------------------------------------------------------

echo "> move clients to client-templates"

echo "  + browser-controller"
client="browser-controller"
rm -Rf "client-templates/${client}"
mv "${dest}/src/clients/${client}" "client-templates/${client}"

echo "  + browser-default"
client="browser-default"
rm -Rf "client-templates/${client}"
mv "${dest}/src/clients/${client}" "client-templates/${client}"

echo "  + node-default"
client="node-default"
rm -Rf "client-templates/${client}"
mv "${dest}/src/clients/${client}" "client-templates/${client}"

# ------------------------------------------------------------

echo "> move build dedicated files into build-tools"
rm -f build-tools/*
mv "${dest}/babel.config.js" "build-tools/babel.config.js"
mv "${dest}/webpack.config.js" "build-tools/webpack.config.js"
mv "${dest}/.eslintrc" "build-tools/.eslintrc"

