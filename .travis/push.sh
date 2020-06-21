#!/bin/sh

setup_git() {
  echo 'START SETUP GIT'
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis BOT"
  # Keep track of where Travis put us.
  # We are on a detached head, and we need to be able to go back to it.
  local build_head=$(git rev-parse HEAD)

  # Fetch all the remote branches. Travis clones with `--depth`, which
  # implies `--single-branch`, so we need to overwrite remote.origin.fetch to
  # do that.
  git config --replace-all remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
  git fetch
  git reset --hard
  # create the tacking branches
  for branch in $(git branch -r|grep -v HEAD) ; do
      git checkout -qf ${branch#origin/}
  done

  # finally, go back to where we were at the beginning
  git checkout ${build_head}
    echo 'END SETUP GIT'
}

setup_git

git config --add remote.origin.fetch +refs/heads/*:refs/remotes/origin/* || exit
git fetch --all || exit
git checkout master || exit
git merge --no-ff "$TRAVIS_COMMIT" || exit
git remote set-url --add --push origin git@git.epitech.eu:/gauthier.betaucourt@epitech.eu/YEP_project1_2019
git push git+ssh://git@github.com/${TRAVIS_REPO_SLUG}.git master
git push git+ssh://git@git.epitech.eu:/gauthier.betaucourt@epitech.eu/YEP_project1_2019 master

