import {environment} from "../../../environments/environment";

const {
  storageURL,
  sampleURL
} = environment;


const debug = (...info) => console.log.apply(null, ["CORE.DEBUG", "|", ...info]);

export function getStorageURL(title, fileType= '.mp3') {
  if (!title.endsWith(fileType)) {
    title += fileType;
  }

  const path = `${storageURL}${`/${title}`.replace(new RegExp('\\/', 'g'), '%2F')}?alt=media`;

  debug("AUDIO.URL | ", title, fileType, " | ", path);

  return path;
}
export function getSampleURL(title, fileType ='.mp3') {
  if (!title.endsWith(fileType)) {
    title += fileType;
  }

  const path = `${sampleURL}${`/${title}`.replace(new RegExp('\\/', 'g'), '%2F')}?alt=media`;

  debug("AUDIO.URL | ", title, fileType, " | ", path);

  return path;
}
