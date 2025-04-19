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
<img width="483" alt="Screenshot 2025-04-18 at 10 28 05 PM" src="https://github.com/user-attachments/assets/d19a4ff4-abed-4bb0-9a4f-538e5b096bff" />

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
<img width="675" alt="Screenshot 2025-04-18 at 10 28 13 PM" src="https://github.com/user-attachments/assets/6104d1c6-ec93-4617-8c89-bb77647181ce" />

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
<img width="674" alt="Screenshot 2025-04-18 at 10 28 25 PM" src="https://github.com/user-attachments/assets/d03d8c35-301a-4206-85b1-2b9b309135b9" />

## Passed all CI workflows
<img width="628" alt="Screenshot 2025-04-18 at 10 28 45 PM" src="https://github.com/user-attachments/assets/5868fdc1-4470-4628-b26a-c0486c09b64b" />
<img width="631" alt="Screenshot 2025-04-18 at 10 28 52 PM" src="https://github.com/user-attachments/assets/47c34610-b269-4671-b858-f7e772eb7175" />
<img width="632" alt="Screenshot 2025-04-18 at 10 28 58 PM" src="https://github.com/user-attachments/assets/89232c32-b6d0-4e11-bd8e-4c29910dd98d" />

