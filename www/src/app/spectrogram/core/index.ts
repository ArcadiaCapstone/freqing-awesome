import {environment} from "../../../environments/environment";

const {
  audioStorageStorageURL,
  uploadsStorageURL
} = environment;


const debug = (...info) => console.log.apply(null, ["CORE.DEBUG", "|", ...info]);

export function getAudioURL(title, fileType= '.mp3') {
  if (!title.endsWith(fileType)) {
    title += fileType;

  }

  const path = `${audioStorageStorageURL}${`/${title}`.replace(new RegExp('\\/', 'g'), '%2F')}?alt=media`;

  debug("AUDIO.URL | ", title, fileType, " | ", path);

  return path;
}
export function getUploadsURL(title, fileType= '.mp3') {
  if (!title.endsWith(fileType)) {
    title += fileType;

  }

  const path = `${uploadsStorageURL}${`/${title}`.replace(new RegExp('\\/', 'g'), '%2F')}?alt=media`;

  debug("AUDIO.URL | ", title, fileType, " | ", path);

  return path;
}
