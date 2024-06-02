// @ts-check
import {screenshotApp, corsApp} from './server';
import {Server} from 'http';
import {config as KarmaConfig, Server as KarmaServer} from 'karma';
import * as path from 'path';

const karmaTestRunner = () =>
    new Promise((resolve, reject) => {
        const karmaConfig = KarmaConfig.parseConfig(path.resolve(__dirname, '../karma.conf.js'), {});
        const server = new KarmaServer(karmaConfig, (exitCode) => {
            if (exitCode > 0) {
                reject(`Karma has exited with ${exitCode}`);
            } else {
                resolve(undefined);
            }
        });
        server.on('run_complete', (_browsers, _results) => {
            server.stop();
        });
        server.start();
    });
/** @type {Server[]} **/
const servers = [];

servers.push(screenshotApp.listen(8000));
servers.push(corsApp.listen(8081));

karmaTestRunner()
    .then(() => {
        servers.forEach((server) => server.close());
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
