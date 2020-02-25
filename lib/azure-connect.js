const storage = require('azure-storage');
const memoizeOne = require('memoize-one');
const streams = require('memory-streams');

const getFileService = memoizeOne(conn => storage.createFileService(conn));

const getFiles = (conn, map) =>
  new Promise((resolve, reject) => {
    const fileService = getFileService(conn);
    fileService.listFilesAndDirectoriesSegmented(
      map,
      '',
      null,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        const { entries } = result;
        const { files } = entries;
        resolve(files);
      }
    );
  });

const readRawFile = (conn, map, fileName) =>
  new Promise((resolve, reject) => {
    const fileService = getFileService(conn);

    fileService.getFileToText(
      map,
      '',
      fileName,
      null,
      (error, result, response) => {
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );
  });


const saveFileFromStream = (conn, map, fileName, content, size) =>
  new Promise((resolve, reject) => {
    const fileService = getFileService(conn);
    fileService.createFileFromStream(
      map,
      '',
      fileName,
      content,
      size,
      (error, result, response) => {
        if (error) {
          return reject(error);
        }
        resolve(true);
      }
    );
  });

module.exports = {
  getFiles,
  readRawFile,
  saveFileFromStream,
};

