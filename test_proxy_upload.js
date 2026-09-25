const fs = require('fs');
async function testUploadProxy() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@ats.demo', password: 'Demo@123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const formData = new FormData();
  // using Frontend Developer job
  formData.append('jobId', '6ca9e48a-4a8b-4d69-bb22-ef1d5c2aaac1');
  
  const blob = new Blob(['Proxy Upload Test 2'], { type: 'text/plain' });
  formData.append('cv', blob, 'proxytest2.txt');

  try {
    const res = await fetch('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    const text = await res.text();
    console.log("PROXY RESULT:", res.status, text);
    
    if (res.status === 201) {
       const app = JSON.parse(text);
       console.log("Checking if file exists in backend/storage/cv/" + app.cvUrl);
       const exists = fs.existsSync('backend/storage/cv/' + app.cvUrl);
       console.log("Exists:", exists);
    }
  } catch(e) {
    console.error(e);
  }
}
testUploadProxy();
