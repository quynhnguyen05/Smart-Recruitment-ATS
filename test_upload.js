const fs = require('fs');
async function testUpload() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@ats.demo', password: 'Demo@123' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  const formData = new FormData();
  formData.append('jobId', '121c2253-bb74-41fe-b213-7de35fde2619');
  
  const blob = new Blob(['Hello World text cv'], { type: 'text/plain' });
  formData.append('cv', blob, 'testcv.txt');

  try {
    const res = await fetch('http://localhost:3001/api/applications', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });
    const text = await res.text();
    console.log(res.status, text);
  } catch(e) {
    console.error(e);
  }
}
testUpload();
