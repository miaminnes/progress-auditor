"use strict";function createAssignment(e,t,n={}){return{id:e,dueDate:t,attributes:n}}var Assignment=Object.freeze({createAssignment:createAssignment});const ASSIGNMENT_KEY="assignment",OUTPUT_LOG="db.assignment.log";function setupDatabase(e){return ASSIGNMENT_KEY in e||(e[ASSIGNMENT_KEY]=new Map),e}function addAssignment(e,t,n,s,r={}){const a=e[ASSIGNMENT_KEY];let o;if(a.has(t)?o=a.get(t):a.set(t,o={}),n in o)return e.throwError(ASSIGNMENT_KEY,"Found duplicate assignment for user",t),null;{const e=createAssignment(n,new Date(s.getTime()),r);return o[n]=e,e}}function getAssignmentByID(e,t,n){return e[ASSIGNMENT_KEY].get(t)[n]}function getAssignmentsByUser(e,t){return Object.keys(e[ASSIGNMENT_KEY].get(t))}function outputLog(e,t="."){const n=e[ASSIGNMENT_KEY],s={};for(const[e,t]of n.entries())s[e]=t;const r=`${`${"# ".repeat(20)}\n# Assignments\n# Size: ${n.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(s,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG),r)}var AssignmentDatabase=Object.freeze({ASSIGNMENT_KEY:ASSIGNMENT_KEY,setupDatabase:setupDatabase,addAssignment:addAssignment,getAssignmentByID:getAssignmentByID,getAssignmentsByUser:getAssignmentsByUser,outputLog:outputLog});function createDatabase(){return{_errors:[],throwError(...e){this._errors.push(e.map(e=>{switch(typeof e){case"string":return e;case"object":return JSON.stringify(e,null,4);default:return String(e)}}).join(" "))},clearErrors(){this._errors.length=0},getErrors(){return this._errors}}}var Database=Object.freeze({createDatabase:createDatabase});function createReview(e,t,n,s,r){return{id:e,date:t,comment:n,type:s,params:r}}var Review=Object.freeze({createReview:createReview});const REVIEW_KEY="review",OUTPUT_LOG$1="db.review.log";function setupDatabase$1(e){return REVIEW_KEY in e||(e[REVIEW_KEY]=new Map),e}function addReview(e,t,n,s,r,a){const o=e[REVIEW_KEY];if(o.has(t))return e.throwError(REVIEW_KEY,"Found duplicate ids for reviews",t),null;{const e=createReview(t,n,s,r,a);return o.set(t,e),e}}function getReviews(e){return e[REVIEW_KEY].keys()}function getReviewByID(e,t){return e[REVIEW_KEY].get(t)}function outputLog$1(e,t="."){const n=e[REVIEW_KEY],s={};for(const[e,t]of n.entries())s[e]=t;const r=`${`${"# ".repeat(20)}\n# Reviews\n# Size: ${n.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(s,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG$1),r)}var ReviewDatabase=Object.freeze({REVIEW_KEY:REVIEW_KEY,setupDatabase:setupDatabase$1,addReview:addReview,getReviews:getReviews,getReviewByID:getReviewByID,outputLog:outputLog$1});const ONE_DAYTIME=864e5;function compareDates(e,t){return e.getTime()-t.getTime()}function isWithinDates(e,t,n){return compareDates(e,t)>=0&&compareDates(e,n)<=0}function getDaysBetween(e,t){return Math.floor(Math.abs(compareDates(t,e))/ONE_DAYTIME)}function getPastSunday(e,t=0){const n=new Date(e.getTime());return n.setUTCDate(n.getUTCDate()-n.getUTCDay()+t),n}function getNextSunday(e,t=0){const n=new Date(e.getTime());return n.setUTCDate(n.getUTCDate()-n.getUTCDay()+7+t),n}function getNextEffectiveSunday(e,t=0){return e.getUTCDay()>t?getNextSunday(new Date(e.getTime()+7*ONE_DAYTIME)):getNextSunday(e)}function offsetDate(e,t=0){const n=new Date(e.getTime());return t&&n.setUTCDate(n.getUTCDate()+t),n}var DateUtil=Object.freeze({ONE_DAYTIME:ONE_DAYTIME,compareDates:compareDates,isWithinDates:isWithinDates,getDaysBetween:getDaysBetween,getPastSunday:getPastSunday,getNextSunday:getNextSunday,getNextEffectiveSunday:getNextEffectiveSunday,offsetDate:offsetDate});const ONE_DAYTIME$1=864e5;function calculateNumberOfSlipDays(e){return 3*e.weeks}function createSchedule(e,t,n={}){const s=n.threshold||0,r=ONE_DAYTIME$1*s,a=getNextEffectiveSunday(e,s),o=t.getTime()-r,i=getPastSunday(e),u=new Date(i.getTime());let c=0;for(;u.getTime()<o;)u.setUTCDate(u.getUTCDate()+7),++c;return{startDate:e,endDate:t,weeks:c,startSunday:i,firstSunday:a,lastSunday:u}}var Schedule=Object.freeze({ONE_DAYTIME:ONE_DAYTIME$1,calculateNumberOfSlipDays:calculateNumberOfSlipDays,createSchedule:createSchedule});const SCHEDULE_KEY="schedule",OUTPUT_LOG$2="db.schedule.log";function setupDatabase$2(e){return SCHEDULE_KEY in e||(e[SCHEDULE_KEY]=new Map),e}function addSchedule(e,t,n,s,r={}){const a=e[SCHEDULE_KEY];if(a.has(t))return e.throwError(SCHEDULE_KEY,"Found duplicate schedules for user",userId),null;{const e=createSchedule(n,s,r);return a.set(t,e),e}}function getScheduleByUserID(e,t){return e[SCHEDULE_KEY].get(t)}function outputLog$2(e,t="."){const n=e[SCHEDULE_KEY],s={};for(const[e,t]of n.entries())s[e]=t;const r=`${`${"# ".repeat(20)}\n# Schedules\n# Size: ${n.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(s,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG$2),r)}var ScheduleDatabase=Object.freeze({SCHEDULE_KEY:SCHEDULE_KEY,setupDatabase:setupDatabase$2,addSchedule:addSchedule,getScheduleByUserID:getScheduleByUserID,outputLog:outputLog$2});function createSubmission(e,t,n,s,r={}){return{id:e,owner:t,assignment:n,date:s,attributes:r}}var Submission=Object.freeze({createSubmission:createSubmission});const SUBMISSION_KEY="submission",SUBMISSION_OWNER_KEY="owner",SUBMISSION_LIST_KEY="list",OUTPUT_LOG$3="db.submission.log";function setupDatabase$3(e){SUBMISSION_KEY in e||(e[SUBMISSION_KEY]={});const t=e[SUBMISSION_KEY];return SUBMISSION_OWNER_KEY in t||(t[SUBMISSION_OWNER_KEY]=new Map),SUBMISSION_LIST_KEY in t||(t[SUBMISSION_LIST_KEY]=new Map),e}function addSubmission(e,t,n,s,r,a={}){const o=e[SUBMISSION_KEY],i=o[SUBMISSION_OWNER_KEY],u=o[SUBMISSION_LIST_KEY];if(u.has(t))return e.throwError(SUBMISSION_KEY,"Found duplicate submission with same id",t),null;{Array.isArray(n)&&(n=n[0]);const e=createSubmission(t,n,s,r,a);let o=i.get(n);return o||i.set(n,o={}),addSubmissionToAssignment(e,s,o),u.set(t,e),e}}function addSubmissionToAssignment(e,t,n){if(e.assignment=t,t in n){const s=n[t];let r=0;for(;r<s.length&&!(compareDates(e.date,s[r].date)<0);++r);s.splice(r,0,e)}else n[t]=[e];return e}function changeSubmissionAssignment(e,t,n){const s=e[SUBMISSION_KEY][SUBMISSION_OWNER_KEY].get(t.owner),r=s[t.assignment],a=r.indexOf(t);if(!(a>=0))throw new Error(`Cannot find submission for assignment ${t.assignment}.`);return r.splice(a,1),r.length<=0&&delete s[t.assignment],void 0!==n&&addSubmissionToAssignment(t,n,s),t}function getAssignedSubmissionsByOwnerKey(e,t){return e[SUBMISSION_KEY][SUBMISSION_OWNER_KEY].get(t)}function getSubmissionByID(e,t){return e[SUBMISSION_KEY][SUBMISSION_LIST_KEY].get(t)}function getOwners(e){return e[SUBMISSION_KEY][SUBMISSION_OWNER_KEY].keys()}function getSubmissions(e){return e[SUBMISSION_KEY][SUBMISSION_LIST_KEY].keys()}function clearSubmissionsByOwner(e,t){const n=e[SUBMISSION_KEY][SUBMISSION_LIST_KEY],s=getAssignedSubmissionsByOwnerKey(e,t);if(s)for(const e of Object.values(s))for(const t of e)n.delete(t.id);e[SUBMISSION_KEY][SUBMISSION_OWNER_KEY].delete(t)}function removeSubmissionByID(e,t){const n=e[SUBMISSION_KEY][SUBMISSION_LIST_KEY],s=n.get(t);if(!s)throw new Error(`Cannot find submission for id ${t}.`);n.delete(t),changeSubmissionAssignment(e,s)}function outputLog$3(e,t="."){const n=e[SUBMISSION_KEY][SUBMISSION_OWNER_KEY],s=e[SUBMISSION_KEY][SUBMISSION_LIST_KEY],r={owner:{},list:{}};for(const[e,t]of n.entries())r.owner[e]=t;for(const[e,t]of s.entries())r.list[e]=t;const a=`${`${"# ".repeat(20)}\n# Submissions\n# Size: ${s.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(r,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG$3),a)}var SubmissionDatabase=Object.freeze({SUBMISSION_KEY:SUBMISSION_KEY,SUBMISSION_OWNER_KEY:SUBMISSION_OWNER_KEY,SUBMISSION_LIST_KEY:SUBMISSION_LIST_KEY,setupDatabase:setupDatabase$3,addSubmission:addSubmission,addSubmissionToAssignment:addSubmissionToAssignment,changeSubmissionAssignment:changeSubmissionAssignment,getAssignedSubmissionsByOwnerKey:getAssignedSubmissionsByOwnerKey,getSubmissionByID:getSubmissionByID,getOwners:getOwners,getSubmissions:getSubmissions,clearSubmissionsByOwner:clearSubmissionsByOwner,removeSubmissionByID:removeSubmissionByID,outputLog:outputLog$3});function createUser(e,t,n,s){return{id:e,ownerKey:t,name:n,attributes:s}}var User=Object.freeze({createUser:createUser});const USER_KEY="user",OUTPUT_LOG$4="db.user.log";function setupDatabase$4(e){return USER_KEY in e||(e[USER_KEY]=new Map),e}function addUser(e,t,n,s,r={}){const a=e[USER_KEY];if(a.has(t))return e.throwError("Found duplicate user with id '"+t+"'."),null;{const e=createUser(t,n,s,r);return a.set(t,e),e}}function getUsers(e){return e[USER_KEY].keys()}function getUserByID(e,t){return e[USER_KEY].get(t)}function getUserByOwnerKey(e,t){const n=e[USER_KEY];for(const e of n.values())if(Array.isArray(e.ownerKey)){if(e.ownerKey.includes(t))return e.id}else if(e.ownerKey==t)return e.id;return null}function getUsersByAttribute(e,t,n){let s=[];const r=e[USER_KEY];for(const e of r.values())if(t in e.attributes){const r=e.attributes[t];Array.isArray(r)?r.includes(n)&&s.push(e.id):r==n&&s.push(e.id)}else null===n&&s.push(e.id);return s}function outputLog$4(e,t="."){const n=e[USER_KEY],s={};for(const[e,t]of n.entries())s[e]=t;const r=`${`${"# ".repeat(20)}\n# Users\n# Size: ${n.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(s,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG$4),r)}var UserDatabase=Object.freeze({USER_KEY:USER_KEY,setupDatabase:setupDatabase$4,addUser:addUser,getUsers:getUsers,getUserByID:getUserByID,getUserByOwnerKey:getUserByOwnerKey,getUsersByAttribute:getUsersByAttribute,outputLog:outputLog$4});function computeDatesWithPadding(e,t,n){switch(e){case"week":return[getPastSunday(t),getNextEffectiveSunday(n,3)];default:const s=Number(e);if(Number.isNaN(s))throw new Error(`Unknown padding type '${e}'.`);return[new Date(t.getTime()-ONE_DAYTIME*s),new Date(n.getTime()+ONE_DAYTIME*s)]}}function createVacation(e,t,n,s,r,a){const[o,i]=computeDatesWithPadding(r,n,s);return{id:e,userID:t,userStartDate:n,userEndDate:s,effectiveStartDate:o,effectiveEndDate:i,padding:r,duration:getDaysBetween(n,s),attributes:a}}var Vacation=Object.freeze({createVacation:createVacation});const VACATION_KEY="vacation",OUTPUT_LOG$5="db.vacation.log";function setupDatabase$5(e){return VACATION_KEY in e||(e[VACATION_KEY]=new Map),e}function addVacation(e,t,n,s,r=s,a=0,o={}){const i=e[VACATION_KEY];if(i.has(t))return e.throwError("Found duplicate vacation with id '"+t+"'."),null;{const e=createVacation(t,n,s,r,a,o);return i.set(t,e),e}}function offsetDateByVacations(e,t,n){const s=e[VACATION_KEY],r=getVacationsByUserID(e,t);r.sort((e,t)=>s.get(e).effectiveStartDate.getTime()-s.get(t).effectiveStartDate.getTime());let a=new Date(n.getTime());for(const e of r){const t=s.get(e);if(isWithinDates(a,t.effectiveStartDate,t.effectiveEndDate)){const e=getDaysBetween(a,t.effectiveStartDate);a.setTime(a.getTime()+e*ONE_DAYTIME)}}return a}function getVacations(e){return e[VACATION_KEY].keys()}function getVacationByID(e,t){return e[VACATION_KEY].get(t)}function getVacationsByUserID(e,t){const n=e[VACATION_KEY],s=[];for(const e of n.values())e.userID==t&&s.push(e.id);return s}function getVacationsByAttribute(e,t,n){let s=[];const r=e[VACATION_KEY];for(const e of r.values())if(t in e.attributes){const r=e.attributes[t];Array.isArray(r)?r.includes(n)&&s.push(e.id):r==n&&s.push(e.id)}else null===n&&s.push(e.id);return s}function outputLog$5(e,t="."){const n=e[VACATION_KEY],s={};for(const[e,t]of n.entries())s[e]=t;const r=`${`${"# ".repeat(20)}\n# Vacations\n# Size: ${n.size}\n${"# ".repeat(20)}`}\n${JSON.stringify(s,null,4)}`;require("fs").writeFileSync(require("path").resolve(t,OUTPUT_LOG$5),r)}var VacationDatabase=Object.freeze({VACATION_KEY:VACATION_KEY,setupDatabase:setupDatabase$5,addVacation:addVacation,offsetDateByVacations:offsetDateByVacations,getVacations:getVacations,getVacationByID:getVacationByID,getVacationsByUserID:getVacationsByUserID,getVacationsByAttribute:getVacationsByAttribute,outputLog:outputLog$5});async function setupDatabase$6(e){const t=createDatabase();return setupDatabase$4(t),setupDatabase$2(t),setupDatabase$3(t),setupDatabase(t),setupDatabase$1(t),setupDatabase$5(t),t}var DatabaseSetup=Object.freeze({setupDatabase:setupDatabase$6});const path=require("path");async function loadAssignments(e,t){if(!("assignments"in t))return console.log("......No assignments found..."),Promise.resolve([]);const n=[];for(const s of t.assignments){const t=s.name,r=s.filePath,a=require(r);console.log(`......Assigning '${path.basename(s.name)}' with '${path.basename(s.filePath)}'...`);for(const r of getUsers(e)){const o=getScheduleByUserID(e,r);n.push(a.assign(e,t,r,o,s.opts))}}return Promise.all(n)}var AssignmentLoader=Object.freeze({loadAssignments:loadAssignments});const fs=require("fs"),readline=require("readline"),Papa=require("papaparse");function readJSONFile(e){const t=fs.readFileSync(e);return JSON.parse(t)}function readCSVFileByRow(e,t){return new Promise((n,s)=>{const r=fs.createReadStream(e);Papa.parse(r,{step:e=>t(e.data),complete:n,error:s})})}function readFileByLine(e,t){return new Promise((n,s)=>{const r=fs.createReadStream(e),a=readline.createInterface({input:r});r.on("error",e=>{console.error(e),s(e)}),a.on("line",t),a.on("close",()=>{n()})})}function writeToFile(e,t){fs.writeFile(e,t,function(t){if(t)return console.log(t);console.log("File saved:",e)})}function writeTableToCSV(e,t){writeToFile(e,t.map(e=>e.join(",")).join("\n"))}var FileUtil=Object.freeze({readJSONFile:readJSONFile,readCSVFileByRow:readCSVFileByRow,readFileByLine:readFileByLine,writeToFile:writeToFile,writeTableToCSV:writeTableToCSV});const path$1=require("path"),fs$1=require("fs"),DEFAULT_CONFIG_FILE_NAME="config.json";async function loadConfig(e){if(console.log(`......Finding config file '${e}'...`),!fs$1.existsSync(e))return console.error("Cannot find non-existant config file."),Promise.resolve({});let t,n;if(fs$1.lstatSync(e).isDirectory()?(t=readJSONFile(path$1.resolve(e,DEFAULT_CONFIG_FILE_NAME)),n=e):(t=readJSONFile(e),n=path$1.dirname(e)),"include"in(t=resolveConfigPaths(n,t))){const e=[];for(const n of t.include){const t=await loadConfig(n);e.push(t)}const n=e.reduce((e,t)=>mergeConfigs(t,e),{});t=mergeConfigs(t,n)}return t}function resolveConfigEntry(e,t,n){if(t.toLowerCase().endsWith("path"))return resolveConfigPathEntry(e,n);if(Array.isArray(n)){let t=[];for(const s in n)t.push(resolveConfigEntry(e,s,n[s]));return t}if("object"==typeof n){let t={};for(const[s,r]of Object.entries(n))t[s]=resolveConfigEntry(e,s,r);return t}return n}function resolveConfigPathEntry(e,t){if(Array.isArray(t)){let n=[];for(const s of t)n.push(resolveConfigPathEntry(e,s));return n}return"object"==typeof t?resolveConfigPaths(e,t):"string"==typeof t?path$1.resolve(e,t):t}function resolveConfigPaths(e,t){const n=resolveConfigEntry(e,"",t);return"include"in t&&Array.isArray(t.include)&&(n.include=t.include.map(t=>resolveConfigPathEntry(e,t))),n}function mergeConfigs(e,t){for(const[n,s]of Object.entries(e))n in t?Array.isArray(t[n])&&(Array.isArray(s)?t[n]=t[n].concat(s):t[n].push(s)):t[n]=e[n];return t}var ConfigLoader=Object.freeze({loadConfig:loadConfig});const path$2=require("path");async function loadDatabase(e,t){if(!("parsers"in t))return console.log("......No parsers found..."),Promise.resolve([]);const n=t.inputPath||".",s=[];for(const r of t.parsers){const t=r.filePath;if(!r.inputFile){e.throwError("Invalid config - missing input file for parser");continue}const a=path$2.resolve(n,r.inputFile),o=require(t);console.log(`......Parsing '${path$2.basename(r.inputFile)}' with '${path$2.basename(r.filePath)}'...`),s.push(o.parse(e,a,r.opts))}return Promise.all(s)}var DatabaseLoader=Object.freeze({loadDatabase:loadDatabase});async function review(e,t,n,s){e.throwError(`[UNKNOWN_REVIEW] Unknown review type '${n}'.`)}const path$3=require("path");async function processReviews(e,t){console.log("......Looking over our work...");const n=new Map;n.set("unknown",review);for(const e of t.reviewers){const t=e.filePath,s=e.name,r=require(t);console.log(`.........Reviewing '${s}' with '${path$3.basename(e.filePath)}'...`),n.set(s,r)}const s=[];for(const t of getReviews(e)){const r=getReviewByID(e,t),a=r.type,o=r.params;let i;i=n.has(a)?n.get(a):n.get("unknown"),s.push(i.review(e,t,a,o))}return Promise.all(s)}var ReviewProcessor=Object.freeze({processReviews:processReviews});const path$4=require("path");async function processDatabase(e,t){console.log("......Helping you fix a few things...");const n=[];for(const s of t.resolvers){const t=s.filePath,r=require(t);console.log(`.........Resolving with '${path$4.basename(s.filePath)}'...`),n.push(r.resolve(e,s.opts))}return Promise.all(n)}var DatabaseProcessor=Object.freeze({processDatabase:processDatabase});const path$5=require("path");async function processOutput(e,t){console.log("......Generating reports for you...");const n=[];for(const s of t.outputs){const r=s.filePath,a=require(r);console.log(`.........Outputting with '${path$5.basename(s.filePath)}'...`),n.push(a.output(e,t.outputPath,s.opts))}return Promise.all(n)}var OutputProcessor=Object.freeze({processOutput:processOutput});const readline$1=require("readline"),readlineInterface=readline$1.createInterface({input:process.stdin,output:process.stdout});async function question(e){return new Promise((t,n)=>{readlineInterface.on("close",n),readlineInterface.question(e,t)})}async function quit(){readlineInterface.close()}var ConsoleHelper=Object.freeze({question:question,quit:quit});function parseName(e){return e}function parseEmail(e,...t){const n=e.split(",").map(e=>{if(e)return e.trim().toLowerCase()});if(t.length>0)for(const e of t){const t=parseEmail(e);if(Array.isArray(t))for(const e of t)n.push(e);else n.push(t)}return 1===n.length?n[0]:n}var FieldParser=Object.freeze({parseName:parseName,parseEmail:parseEmail});function stringHash(e=""){let t=0;for(let n=0,s=e.length;n<s;n++)t=Math.imul(31,t)+e.charCodeAt(n)|0;return t}function uuid(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}var MathHelper=Object.freeze({stringHash:stringHash,uuid:uuid});function parseDate(e){const t=new Date(1e3),n=Number(e.substring(0,4)),s=Number(e.substring(5,7)),r=Number(e.substring(8,10)),a=Number(e.substring(11,13)),o=Number(e.substring(14,16)),i=Number(e.substring(17,19));if(NaN===n||NaN===s||NaN===r||NaN===a||NaN===o||NaN===i)throw new Error("Invalid date format - should be YYYY-MM-DD HH:MM:SS.");return t.setUTCFullYear(n),t.setUTCMonth(s-1),t.setUTCDate(r),t.setUTCHours(a),t.setUTCMinutes(o),t.setUTCSeconds(i),t}function parseAmericanDate(e){const t=new Date(1e3),n=e.split("/"),s=Number(n[2]),r=Number(n[0]),a=Number(n[1]);if(NaN===s||NaN===r||NaN===a)throw new Error("Invalid date format - should be MM/DD/YYYY.");return t.setUTCFullYear(s),t.setUTCMonth(r-1),t.setUTCDate(a),t}var ParseUtil=Object.freeze({parseDate:parseDate,parseAmericanDate:parseAmericanDate});const IDENTITY=function(e){return e};class TableBuilder{constructor(){this.entries=[],this.columns=[]}addEntry(...e){this.entries.push(e)}addColumn(e,t=IDENTITY){this.columns.push({header:e,data:t})}build(){const e=[];for(const t of this.columns)e.push(t.header);const t=[];t.push(e);for(const e of this.entries){const n=[];for(const t of this.columns){const s=t.data.apply(null,e);n.push(s)}t.push(n)}return t}}const path$6=require("path");async function output(e,t,n){let s;outputLog$4(e,t),outputLog$2(e,t),outputLog$3(e,t),outputLog(e,t),outputLog$1(e,t),outputLog$5(e,t),writeToFile(path$6.resolve(t,"config.log"),JSON.stringify(n,null,4)),s=e.getErrors().length<=0?"HOORAY! No errors!":"It's okay. We'll get through this.\n\n"+e.getErrors().join("\n"),writeToFile(path$6.resolve(t,"errors.txt"),s)}var DebugInfoOutput=Object.freeze({output:output});const DAYS_PER_WEEK=7,MAX_GENERATED_ASSIGNMENTS=100;function assign(e,t,n,s,r={}){return addAssignment(e,t,n,offsetDateByVacations(e,t,s),r)}function assignWeekly(e,t,n,s,r,a=0,o={}){const i=[];let u;(u=s.getUTCDay()<a?getNextSunday(s):getPastSunday(s)).setUTCDate(u.getUTCDate()+a),u=offsetDateByVacations(e,t,u);let c=1;for(;compareDates(u,r)<=0;){const s=addAssignment(e,t,`${n}[${c}]`,u,Object.assign({},o));if(i.push(s),u.setUTCDate(u.getUTCDate()+DAYS_PER_WEEK),u=offsetDateByVacations(e,t,u),++c>=MAX_GENERATED_ASSIGNMENTS)break}return i}var AssignmentGenerator=Object.freeze({assign:assign,assignWeekly:assignWeekly});const DATABASE_EXPORTS={Assignment:Assignment,AssignmentDatabase:AssignmentDatabase,Database:Database,Review:Review,ReviewDatabase:ReviewDatabase,Schedule:Schedule,ScheduleDatabase:ScheduleDatabase,Submission:Submission,SubmissionDatabase:SubmissionDatabase,User:User,UserDatabase:UserDatabase,Vacation:Vacation,VacationDatabase:VacationDatabase},PIPELINE_EXPORTS={DatabaseSetup:DatabaseSetup,AssignmentLoader:AssignmentLoader,ConfigLoader:ConfigLoader,DatabaseLoader:DatabaseLoader,ReviewProcessor:ReviewProcessor,DatabaseProcessor:DatabaseProcessor,OutputProcessor:OutputProcessor},UTIL_EXPORTS={ConsoleHelper:ConsoleHelper,DateUtil:DateUtil,FieldParser:FieldParser,FileUtil:FileUtil,MathHelper:MathHelper,ParseUtil:ParseUtil,TableBuilder:TableBuilder},LIB_EXPORTS={DebugInfoOutput:DebugInfoOutput,AssignmentGenerator:AssignmentGenerator},Library={...DATABASE_EXPORTS,...PIPELINE_EXPORTS,...UTIL_EXPORTS,...LIB_EXPORTS};async function run(e="./config.json"){global.Library=Library,console.log("Starting...");const t=await loadConfig(e),n=await setupDatabase$6();n.currentDate="currentDate"in t?parseAmericanDate(t.currentDate):new Date(Date.now()),console.log("...Loading..."),await loadDatabase(n,t),await loadAssignments(n,t),console.log("...Processing..."),await processReviews(n,t),await processDatabase(n,t),console.log("...Outputting..."),n.getErrors().length>0?(console.log("......Oh no! We found some errors..."),console.log("......Finding debug info for you..."),await output(n,t.outputPath,t),console.log("...Failed!")):(console.log("......Hooray! Everything is as expected..."),t.debug&&(console.log("......Finding debug info for you..."),await output(n,t.outputPath,t)),await processOutput(n,t),console.log("...Success!")),quit(),console.log("......Stopped."),console.log()}const path$7=require("path"),configPath=path$7.resolve(path$7.dirname(process.execPath),process.argv[2]||"./config.json");run(configPath);
