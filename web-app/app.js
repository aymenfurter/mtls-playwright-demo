document.getElementById('fetch-data').addEventListener('click', async () => {
  try {
    const response = await fetch('https://localhost:3000/api/data');
    const data = await response.json();
    document.getElementById('result').textContent = data.message;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
