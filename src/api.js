export const login = async (username, password) => {
  const res = await fetch('/admin/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({username, password})
  });
  if (!res.ok) throw new Error('Login failed');
  const { token } = await res.json();
  return token;
};

export const fetchTimetable = async (token) => {
  const res = await fetch('/admin/raw-timetable', {
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ token })
  });
  return res.json();
};

export const updateTimetable = async (token, data) => {
  const res = await fetch('/admin/update', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ token, data })
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
};
