const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

[uploadsDir, profilesDir, imagesDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const saveBase64Image = (base64Data, prefix = 'profile') => {
  const matches = base64Data.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) return null;

  const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const filename = `${prefix}-${Date.now()}.${ext}`;
  const filepath = path.join(profilesDir, filename);
  fs.writeFileSync(filepath, buffer);
  return `/uploads/profiles/${filename}`;
};

const deleteUploadedFile = (fileUrl) => {
  if (!fileUrl || !fileUrl.startsWith('/uploads/')) return;
  const filepath = path.join(__dirname, '..', fileUrl.replace(/^\//, ''));
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
};

module.exports = { saveBase64Image, deleteUploadedFile, uploadsDir, imagesDir };
