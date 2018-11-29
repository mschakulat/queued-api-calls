/**
 * @author Michael Schakulat <mschakulat@fetchit.de>
 * @copyright by Michael Schakulat
 */

process.on('unhandledRejection', (reason) => {
    throw new Error(`Unhandled Rejection [${reason}], stack: ${reason.stack}`);
});

process.on('uncaughtException', (err) => {
    console.log(err);
});