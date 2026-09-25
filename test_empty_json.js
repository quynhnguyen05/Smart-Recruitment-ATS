async function test() {
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'candidate@ats.demo', password: 'Demo@123' })
  });
  const { token } = await loginRes.json();

  const res = await fetch('http://localhost:3001/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({})
  });
  console.log(res.status, await res.text());
}
test();
