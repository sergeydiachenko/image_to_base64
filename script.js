'use strict';
let fs = require('fs');

let folder = process.argv[2];
let fileName = process.argv[3];

fs.readdir(folder, (err, files) => {
  let obj = {};
  let trigger = false;

  files.map((file, index) => {
    let res = file.match(/([\w-]+)\.(jpe?g|png|gif|tiff)$/);
    if (res) {
      let str = res[1];
      trigger = true;
      fs.readFile(`${folder}/${file}`, function (err, content) {

        obj[str] = `data:image/${res[2]};base64,${content.toString('base64')}`;

        if (index === files.length - 1) {
          fs.writeFileSync(fileName, JSON.stringify(obj));

          fs.readFile(fileName, function (err, content) {
            if (err) {
              console.log(`File "${fileName}" does not exist`);
            } else {
              let obj = JSON.parse(content.toString());
              Object.keys(obj).forEach((image) => {
                console.log(image);
              })
              console.log(`${Object.keys(obj).length} files written`);
            }
          });
        }
        if (err) {
          console.log(`File "${folder}/${file}" does not exist`);
        }
      });
    }
  });

  if (!trigger && files.length) {
    console.log(`Folder "${folder}" does not exist any images`);
  }
  if (!files.length) {
    console.log(`Folder "${folder}" is empty`)
  }
  if (err) {
    console.log(`Folder "${folder}" does not exist`);
  }
});
