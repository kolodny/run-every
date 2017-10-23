var spawn = require('child_process').spawn;

module.exports = runEvery;

function runEvery(repeatWaitSeconds, command, process) {

  var proc;
  var wasKilled = false;
  var timeout;
  var didSetupProcess = false;

  inner();

  function inner() {
    var start = Date.now();
    proc = spawn(command[0], command.slice(1), { stdio: 'inherit' });
    proc.on('exit', function (code, signal) {
      var finished = Date.now();
      if (code === 0 && signal === null) {
        var took = finished - start;
        var next = repeatWaitSeconds * 1000 - took;
        if (next <= 0) next = 0;
        timeout = setTimeout(inner, next);
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
