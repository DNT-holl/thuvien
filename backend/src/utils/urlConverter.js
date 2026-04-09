/**
 * Convert various URL formats to embeddable formats
 */

export const convertPdfUrl = (url) => {
  if (!url) return null;

  let fileId = null;

  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (match1) {
    fileId = match1[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  const match2 = url.match(/id=([a-zA-Z0-9-_]+)/);
  if (!fileId && match2) {
    fileId = match2[1];
  }

  // Format: Direct FILE_ID
  if (!fileId && url.match(/^[a-zA-Z0-9-_]{25,}$/)) {
    fileId = url;
  }

  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }

  return url;
};

export const convertVideoUrl = (url) => {
  if (!url) return null;

  // YouTube short link: https://youtu.be/VIDEO_ID or https://youtu.be/VIDEO_ID?t=...
  const youtubeShortMatch = url.match(/youtu\.be\/([a-zA-Z0-9-_]+)/);
  if (youtubeShortMatch) {
    return `https://www.youtube.com/embed/${youtubeShortMatch[1]}`;
  }

  // YouTube full link: https://www.youtube.com/watch?v=VIDEO_ID
  const youtubeFullMatch = url.match(/watch\?v=([a-zA-Z0-9-_]+)/);
  if (youtubeFullMatch) {
    return `https://www.youtube.com/embed/${youtubeFullMatch[1]}`;
  }

  // YouTube embed already: https://www.youtube.com/embed/VIDEO_ID
  if (url.includes('youtube.com/embed')) {
    return url;
  }

  // Google Drive video: https://drive.google.com/file/d/FILE_ID/view
  const googleDriveMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
  if (googleDriveMatch) {
    return `https://drive.google.com/file/d/${googleDriveMatch[1]}/preview`;
  }

  return url;
};
