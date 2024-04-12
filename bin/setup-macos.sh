#!/bin/bash

which -s brew
if [[ $? != 0 ]] ; then
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
fi

brew info gnupg
if [[ $? != 0 ]] ; then
  brew install gnupg
fi

brew info asdf
if [[ $? != 0 ]] ; then
  brew install asdf
fi

asdf plugin-add nodejs
asdf install

which -s openjdk
if [[ $? != 0 ]] ; then
  brew install openjdk
fi

which -s h2
if [[ $? != 0 ]] ; then
  brew install h2
fi

cp -n .env.example .env

which -s yarn
if [[ $? != 0 ]] ; then
  npm install --global yarn
fi

yarn
