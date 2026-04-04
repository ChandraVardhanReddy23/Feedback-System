const http = require('http');

const data = JSON.stringify({
    email: "student1@college.com",
    password: "s1"
});

const options = {
    hostname: 'localhost',
    port: 3005,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    let body = '';

    console.log(`STATUS: ${res.statusCode}`);

    res.on('data', chunk => body += chunk);

    res.on('end', () => {
        console.log("RESPONSE:", body);

        if (res.statusCode === 200) {
            console.log("✅ LOGIN TEST PASSED");
            process.exit(0);
        } else {
            console.log("❌ LOGIN TEST FAILED");
            process.exit(1);
        }
    });
});

req.on('error', (err) => {
    console.error("❌ ERROR:", err.message);
    process.exit(1);
});

req.write(data);
req.end();