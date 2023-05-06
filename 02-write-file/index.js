const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
  stdin: input,
  stdout: output,
} = require('node:process');

const textDir = path.join(__dirname, 'my_text.txt');
const textFile = fs.createWriteStream(textDir);
const rl = readline.createInterface({ input, output });

rl.question('Write you text, please\n', (answer) => {
  textFile.write(answer);
  rl.on('line', (input) => {
    if (input === 'exit') {
      output.write('Your text in my_text.txt');
      rl.pause();
    } else {
      textFile.write('\n' + input);
    }
  });
  rl.on('SIGINT', () => {
    output.write('Your text in my_text.txt');
    rl.pause();
  });
});
