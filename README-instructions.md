# Instructions



### Set up application  
##### Set up client
```bash
$ cd client/
$ npm install
```
##### Set up server
```bash
$ cd ../server/
$ npm install
```

##### Set environment variables
- in `server/` folder, create a new file `.env`
- set up environment variable `JWT_SECRET` and `TEST_USER_PW`, e.g.:
```bash

JWT_SECRET=examplejwtsecret
TEST_USER_PW=111111Aa
```




### Test the deployed application on Render
Render url:
1. Test signup
   - click on
2. Test login 
   - d
   - 


### Run the cypress test cases
-  run server.ts (⚠️ must run in test env to bypass rate limiter)
```bash
$ cd server/
$ NODE_ENV=test npx ts-node server.ts
```
- run client
```bash
$ cd ../client/
$ npm start
```
- run cypress test
```bash
$ npx cypress run
```

### Run the jest test cases
```bash
# go to server 
$ cd server/

# run single test file 
$ NODE_ENV=test npx jest </path/to/test-file>.test.js

# run all tests
$ NODE_ENV=test npx jest tests/
```

### Generate the coverage report for jest tests
```bash
$ NODE_ENV=test npx jest --coverage
```

### Generate the CodeQL report for server
```bash
# Prepare the code for analysis
$ <extract-root>/codeql/codeql database create <database> --language=javascript-typescript
# Analyze the code and generate report
$ mkdir <path/to/report/>
$ <extract-root>/codeql/codeql database analyze <path/to/codeql-database> --format="sarif-latest" --output <path/to/report/report.sarif>
```