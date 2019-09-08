"use strict";const path=require("path"),fs=require("fs"),DEFAULT_CONFIG_FILE_NAME="config.json";async function loadConfig(t){let n,o;try{t=findValidConfigFilePath(t),o=path.dirname(t)}catch(t){return Promise.reject(t)}try{const o=fs.readFileSync(t);n=JSON.parse(o)}catch(t){return Promise.reject(["Failed to parse config file:","=>",t,"<="])}if("include"in(n=resolveConfigPaths(o,n))){const t=[],o=[];for(const e of n.include)try{const n=await loadConfig(e);o.push(n)}catch(n){t.push(n)}if(t.length>0)return Promise.reject(["Failed to resolve config includes:","=>",t,"<="]);const e=o.reduce((t,n)=>mergeConfigs(n,t),{});n=mergeConfigs(n,e)}return n}function findValidConfigFilePath(t){if(!fs.existsSync(t))throw new Error(`Cannot find non-existant path '${t}'.`);if(fs.lstatSync(t).isDirectory()){const n=t;if(t=path.resolve(n,DEFAULT_CONFIG_FILE_NAME),!fs.existsSync(t))throw new Error(`Cannot find config file in directory '${n}'.`)}return t}function resolveConfigEntry(t,n,o){if(n.toLowerCase().endsWith("path"))return resolveConfigPathEntry(t,o);if(Array.isArray(o)){let n=[];for(const e in o)n.push(resolveConfigEntry(t,e,o[e]));return n}if("object"==typeof o){let n={};for(const[e,r]of Object.entries(o))n[e]=resolveConfigEntry(t,e,r);return n}return o}function resolveConfigPathEntry(t,n){if(Array.isArray(n)){let o=[];for(const e of n)o.push(resolveConfigPathEntry(t,e));return o}return"object"==typeof n?resolveConfigPaths(t,n):"string"==typeof n?path.resolve(t,n):n}function resolveConfigPaths(t,n){const o=resolveConfigEntry(t,"",n);return"include"in n&&Array.isArray(n.include)&&(o.include=n.include.map(n=>resolveConfigPathEntry(t,n))),o}function mergeConfigs(t,n){for(const[o,e]of Object.entries(t))o in n?Array.isArray(n[o])&&(Array.isArray(e)?n[o]=n[o].concat(e):n[o].push(e)):n[o]=t[o];return n}async function askForConfigFilePath(t){return null}async function askWhetherDatabaseIsValidToUse(t,n){return!0}async function loadConfigFile(t){return console.log("...Load config..."),await loadConfig(t)}async function requestConfigFile(t){return console.log("...Request config..."),await askForConfigFilePath()}async function loadDefaultConfig(t){return console.log("...Load default config..."),{inputs:[],outputs:[]}}function createDatabase(t){console.log("...Creating database...")}async function findInputEntries(t){return console.log("...Finding input entries..."),Array.isArray(t.inputs)?t.inputs:[]}async function loadInputEntry(t,n,o){console.log("...Loading input entry...")}async function verifyDatabaseWithClient(t,n){return console.log("...Verifying database with client..."),await askWhetherDatabaseIsValidToUse()}async function findDatabaseErrors(t,n){console.log("...Finding database errors...")}async function shouldContinueResolvingErrorsWithClient(t,n,o){console.log("...Should resolve database errors?")}async function resolveDatabaseErrors(t,n,o){console.log("...Resolving database errors...")}async function verifyErrorsWithClient(t,n,o){if(!o||o.length<=0)return!0}async function outputErrorLog(t,n,o){console.log("...Outputting database errors...")}function findOutputEntries(t){return console.log("...Finding output entries..."),Array.isArray(t.outputs)?t.outputs:[]}function processOutputEntry(t,n,o){console.log("...Process output entry...")}const DIRECTORY=".";async function main(t){try{const t=await resolveConfig(DIRECTORY),n=await resolveDatabase(t);await validateDatabase(n,t),await generateOutput(n,t)}catch(t){return console.error("Program failed.",t),!1}return!0}async function resolveConfig(t){let n;console.log("Resolving config...");try{n=await loadConfigFile(t)}catch(t){let o;for(;o=await requestConfigFile();)try{if(n=await loadConfigFile(o))break}catch(t){console.error("Failed to load config.",t)}n||(n=await loadDefaultConfig())}if(!n)throw new Error("Could not resolve a config file for program. Stopping program...");return n}async function resolveDatabase(t){console.log("Resolving database...");const n=createDatabase(),o=await findInputEntries(t);for(const e of o)try{await loadInputEntry(n,t,e)}catch(t){console.error("Failed to load input entry.",t)}if(!await verifyDatabaseWithClient())throw new Error("Could not resolve database for program. Please update the config to match your specifications, then try again. Stopping program...");return n}async function validateDatabase(t,n){let o;for(console.log("Validating database...");(o=await findDatabaseErrors())&&await shouldContinueResolvingErrorsWithClient();)await resolveDatabaseErrors();if(!await verifyErrorsWithClient(t,n,o))throw await outputErrorLog(),new Error("Could not validate database. Stopping program...")}async function generateOutput(t,n){console.log("Generating output...");const o=findOutputEntries(n);for(const e of o)try{processOutputEntry(t,n,e)}catch(t){console.error("Failed to process output entry.",t)}}main(process.argv).then(t=>{t?console.log("Success!"):console.log("Failure!")});
