var spawn = require('child_process').spawn;

module.exports = runEvery;

function runEvery(repeatWaitSeconds, command, process) {

  var proc;
  var wasKilled = false;
  var timeout;
  var didSetupProcess = false;

  inner();

  function inner() {
    proc = spawn(command[0], command.slice(1), { stdio: 'inherit' });
    proc.on('exit', function (code, signal) {

      if (code === 0 && signal === null) {
        timeout = setTimeout(inner, repeatWaitSeconds * 1000);
      } else {
        process.kill(process.pid, signal);
      }

    });

    if (!didSetupProcess) {
      process.on('SIGINT', function () {
        clearTimeout(timeout);
        proc.kill('SIGINT');
        proc.kill('SIGTERM');
      });
      didSetupProcess = true;
    }
  }


}
