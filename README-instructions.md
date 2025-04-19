# Instructions



## Test the deployed application on Render
**Render endpoints**
- client: https://fakeso-client.onrender.com
- server: https://fakeso-server.onrender.com

**Functional Features**
1. Signup
   - sign up with required info
2. Login 
   - Optionally, you can use `testuser` to login without signing up 
     - Username: testuser@test.com
     - Password: Ptestuser1

3. View/manage profile 
   - After login, click Profile tag on the sidebar 
   - Profile management options
     - Edit profile 
     - Change password
     - Delete Account 
4. Vote an answer 
   - Click a question 
   - Click a thumb up icon to upvote an answer 
   - Click again to unvote
5. Comment an answer 
   - Click "ADD A COMMENT" button to add a comment to an answer 

**Non-functional feature**
- Used Material UI for enhanced and unified UI design 


## Set up application locally 
##### Set up client
```bash
$ cd ./client
$ npm install
```
##### Set up server
```bash
$ cd ./server
$ npm install
```

##### Set environment variables
- in `server/` folder, create a new file `.env`
- set up environment variable `JWT_SECRET`, e.g.
```bash
JWT_SECRET=examplejwtsecret
```



## Run the cypress test cases
-  run server.ts (⚠️ must run in test env to bypass rate limiter)
```bash
$ cd ./server
$ NODE_ENV=test npx ts-node server.ts
```
- run client
```bash
$ cd ./client
$ npm start
```
- run cypress test
```bash
$ npx cypress run
# optionally
$ npx cypress open
```

## Run the jest test cases
```bash
# go to server 
$ cd server/

# run single test file 
$ NODE_ENV=test npx jest </path/to/test-file>.test.js

# run all tests
$ NODE_ENV=test npx jest tests/
```

## Generate the coverage report for jest tests
```bash
$ NODE_ENV=test npx jest --coverage
```

## Generate the CodeQL report for server
```bash
# Prepare the code for analysis
$ <extract-root>/codeql/codeql database create <database> --language=javascript-typescript

# Analyze the code and generate report
$ mkdir <path/to/report/>
$ <extract-root>/codeql/codeql database analyze <path/to/codeql-database> --format="sarif-latest" --output <path/to/report/report.sarif>

# View quick stats about the report
npx ts-node codeql-quick-stats.ts <path/to/report/report.sarif> -t
npx ts-node codeql-quick-stats.ts <path/to/report/report.sarif> -n
npx ts-node codeql-quick-stats.ts <path/to/report/report.sarif> -d
```