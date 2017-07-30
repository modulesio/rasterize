#!/usr/bin/env node

const path = require('path');

const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const ghd = require('ghd');
const tar = require('tar');

const isWindows = /^win/.test(process.platform);

const zipDirname = path.join(__dirname, '..', 'zip');
const binDirname = path.join(__dirname, '..', 'bin');
const username = 'modulesio';
const repo = 'chromium-zeo';
const hash = '4730b34dad34142a9971634e58f87bc3a612c7ac';
const fileSpec = isWindows ? {
  username,
  repo,
  hash,
  path: '/windows.tar.gz',
  file: path.join(zipDirname, 'windows.tar.gz'),
} : {
  username,
  repo,
  hash,
  path: '/linux.tar.gz',
  file: path.join(zipDirname, 'linux.tar.gz'),
};

console.log('downloading binaries...');

rimraf(zipDirname, err => {
  if (!err) {
    mkdirp(zipDirname, err => {
      if (!err) {
        ghd(fileSpec)
          .then(() => {
            console.log('downloaded binaries');

            mkdirp(binDirname, err => {
              if (!err) {
                console.log('extracting binaries...');

                tar.x({
                  file: fileSpec.file,
                  cwd: binDirname,
                  unlink: true,
                }, err => {
                  if (!err) {
                    console.log('extracted binaries');

                    process.exit(0);
                  } else {
                    throw err;
                  }
                });
              } else {
                throw err;
              }
            });
          })
          .catch(err => {
            console.warn(err);
          });
      } else {
        throw err;
      }
    });
  } else {
    throw err;
  }
});