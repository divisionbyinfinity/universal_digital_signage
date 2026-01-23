const fspromise=require('fs/promises');
const fs = require('fs');
const archiver = require('archiver');


const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cheerio = require('cheerio');
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100 MB
// Function to store an image in the specified directory
exports.storeImage=(directory,basePath, file)=> {
  directory=directory
  // Generate a unique filename using UUID
  const uniqueFilename = uuidv4() + '.' + file.originalname.split('.').pop();

  // Create the full path to store the image
  const imagePath = `${directory}/${uniqueFilename}`;
  const url=`${basePath}${uniqueFilename}`
  // Ensure the directory exists; if not, create it
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    // Write the file to the specified directory
    fs.writeFile(imagePath, file.buffer, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

// Function to store multiple images in the specified directory
exports.storeMultipleImages = (directory,basePath, files) => {
  // Ensure the directory exists; if not, create it
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  const promises = [];

  for (const file of files) {
    promises.push(
      new Promise((resolve, reject) => {  
        // Generate a unique filename using UUID
        const uniqueFilename = uuidv4() + '.' + file.originalname.split('.').pop();
        console.log("uniqueFilename",uniqueFilename)
        // Create the full path to store the image
        let imagePath = `${directory}/${uniqueFilename}`;


        // Write the file to the specified directory
        fs.writeFile(imagePath, file.buffer, (err) => {
          if (err) {
            reject(err);    
          } else {
            resolve({url:`${basePath}/${uniqueFilename}`,name:file.originalname,size:file.size/1024});
          }
        });
      })
    );
  }
  
  return Promise.all(promises);
};

exports.deleteFile = async (targetFile) =>{
  return new Promise((resolve,reject)=>{
    try{
      if (!targetFile){
        return reject(new Error('Target File Path is Required'))
      }
      const resolvedPath = path.resolve(targetFile);
      if (!fs.existsSync(resolvedPath)){
        return reject(new Error(`File does not exist: ${resolvedPath}`));
      }
      fs.rm(resolvedPath,(err)=>{
        if (err) {
          console.error('Failed to delete directory:', err);
          return reject(err);
        }
        console.log(`Deleted directory: ${resolvedPath}`);
        resolve();
      })
    }
    catch(err){
      console.log("error deleting file ",err)
      reject(err)
    }
  })
}

exports.moveFile = async (src, dest) => {
  try {
    if (!src || !dest) throw new Error('Source and destination paths are required');

    const resolvedSrc = path.resolve(src);
    const resolvedDest = path.resolve(dest);

    if (!fs.existsSync(resolvedSrc)) throw new Error(`Source file does not exist: ${resolvedSrc}`);

    // Ensure destination directory exists
    const destDir = path.dirname(resolvedDest);
    await fspromise.mkdir(destDir, { recursive: true });

    await fspromise.rename(resolvedSrc, resolvedDest);
    console.log(`File moved from ${resolvedSrc} to ${resolvedDest}`);
    return resolvedDest;
  } catch (err) {
    console.error('Error moving file:', err);
    throw err;
  }
};

/**
 * Move a directory and all its contents from source to destination
 * @param {string} srcDir - source directory path
 * @param {string} destDir - destination directory path
 */

exports.moveDirectory = async (srcDir, destDir) => {
  try {
    if (!srcDir || !destDir) throw new Error('Source and destination directories are required');

    const resolvedSrc = path.resolve(srcDir);
    const resolvedDest = path.resolve(destDir);

    if (!fs.existsSync(resolvedSrc)) throw new Error(`Source directory does not exist: ${resolvedSrc}`);

    // Ensure destination parent directory exists
    await fspromise.mkdir(path.dirname(resolvedDest), { recursive: true });

    // Use fs.rename if moving within the same filesystem, fallback to copy+delete
    try {
      await fspromise.rename(resolvedSrc, resolvedDest);
    } catch {
      // If rename fails (cross-device), do recursive copy and delete
      await copyDirectory(resolvedSrc, resolvedDest);
      await fspromise.rm(resolvedSrc, { recursive: true, force: true });
    }

    console.log(`Directory moved from ${resolvedSrc} to ${resolvedDest}`);
    return resolvedDest;
  } catch (err) {
    console.error('Error moving directory:', err);
    throw err;
  }
};

exports.zipDirectory = async (srcDir, destDir, playlistName) => {
  try {
    if (!srcDir || !destDir) throw new Error('Source and destination directories are required');

    const resolvedSrc = path.resolve(srcDir);
    const resolvedDestDir = path.resolve(destDir);

    if (!fs.existsSync(resolvedSrc)) throw new Error(`Source directory does not exist: ${resolvedSrc}`);

    // Ensure destination directory exists
    await fspromise.mkdir(resolvedDestDir, { recursive: true });

    // Create a unique filename using playlist name + timestamp
    const timestamp = Date.now();
    const zipFileName = `${playlistName.replace(/\s+/g, '_')}_${timestamp}.zip`;
    const zipFilePath = path.join(resolvedDestDir, zipFileName);

    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        console.log(`Zipped directory: ${zipFilePath} (${archive.pointer()} total bytes)`);
        resolve(zipFilePath);
      });

      archive.on('error', (err) => {
        console.error('Error zipping directory:', err);
        reject(err);
      });

      archive.pipe(output);
      archive.directory(resolvedSrc, false); // false means do not include parent folder in zip
      archive.finalize();
    });

  } catch (err) {
    console.error('Error in zipDirectory:', err);
    throw err;
  }
};


exports.deleteDirectory = async (targetDir) => {
  return new Promise((resolve, reject) => {
    try {
      if (!targetDir) {
        return reject(new Error('Target directory path is required'));
      }
      const resolvedPath = path.resolve(targetDir);
      // Check if directory exists
      if (!fs.existsSync(resolvedPath)) {
        return reject(new Error(`Directory does not exist: ${resolvedPath}`));
      }
      // Delete directory recursively
      fs.rm(resolvedPath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error('Failed to delete directory:', err);
          return reject(err);
        }
        console.log(`Deleted directory: ${resolvedPath}`);
        resolve();
      });
    } catch (err) {
      console.error('Error deleting directory:', err);
      reject(err);
    }
  });
};

exports.storeMultipleVideos = async (directory, basePath, files, durations) => {
  // Ensure the directory exists; if not, create it
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  // Process all video files
  const promises = files.map(async (file, index) => {
    console.log('Processing file:', file.originalname,durations[index]);

    if (file.size > MAX_VIDEO_SIZE) {
      return Promise.reject(new Error(`File size exceeds the maximum limit of ${MAX_VIDEO_SIZE / (1024 * 1024)} MB`));
    }

    const uniqueFilename = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const videoPath = `${directory}/${uniqueFilename}`;

    try {
      // Write video file
      await fs.promises.writeFile(videoPath, file.buffer);

      // Get the corresponding duration from the provided array
      const duration = durations[index] || 0; // Default to 0 if not available

      return {
        url: `${basePath}/${uniqueFilename}`,
        name: file.originalname,
        size: file.size / 1024, // Size in KB
        mediaDuration:duration, // Use the passed duration array
      };
    } catch (error) {
      console.error(`Error processing video ${file.originalname}:`, error);
      return null; // Ensure failure does not break all processing
    }
  });

  // Wait for all video processing to complete
  return Promise.all(promises);
};


exports.isFilePathValid = async (filePath) => {
  try {
    await fspromise.access(filePath, fspromise.constants.F_OK | fspromise.constants.R_OK | fspromise.constants.W_OK);
    return true;
  } catch (error) {
    console.error(`Error checking file path "${filePath}":`, error);
    return false;
  }
};

// Helper function to create file from template
exports.createFileFromTemplate=async (hostName,folderPath, playlistUrl,stackedPlaylist=false,schedules=null,templatePath='./templates/index-template.html')=> {
  try {
    // Read the template file
    console.log(hostName,folderPath, playlistUrl,stackedPlaylist,schedules)
    let data = await fs.promises.readFile(templatePath, 'utf8'); 
    console.log('Template data read successfully',data);
    // if(playlistUrl){
    const regex = new RegExp('{{\\s*dynamicPlaylistURL\\s*}}', 'g');      
    data = data.replace(regex, playlistUrl);
    data=data.replace(new RegExp('{{\\s*hostName\\s*}}', 'g'),hostName );
    data = data.replace(new RegExp('{{\\s*stackedPlaylistURL\\s*}}', 'g'), stackedPlaylist? stackedPlaylist : '' );
    const schedulerRegex = /var\s+scheduler\s*=\s*(null|\[.*?\]);/s;
    const schedulerString = schedules ? JSON.stringify(schedules) : "null"; // Convert schedules to a string or default to "null"
    // Replace with your custom value
    data = data.replace(schedulerRegex, `var scheduler = ${schedulerString};`);   
    console.log('Replaced scheduler with:', schedulerString);
    // }
    if (!fs.existsSync(folderPath)){
      fs.mkdirSync(folderPath, { recursive: true });      
    } 
    fs.writeFileSync(path.join(folderPath, 'index.html'), data);
    console.log(`File created at ${folderPath}/index.html`);

    return true
  } catch (error) {
    console.error('Error creating file from template:', error);
    throw error;
  }
}

