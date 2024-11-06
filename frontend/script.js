// Script for doctor to add record
document.getElementById('patientForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const disease = document.getElementById('disease').value;

  const patientData = { name, age, disease };

  try {
    const response = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });
    const result = await response.json();
    alert(result.message);
    document.getElementById('patientForm').reset();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to add record');
  }
});

// Script for patient to view record
async function getPatientRecord() {
  const patientId = document.getElementById('patientId').value;
  if (!patientId) {
    alert('Please enter a patient ID');
    return;
  }

  try {
    const response = await fetch(`/api/records/${patientId}`);
    const result = await response.json();
    if (result.message) {
      document.getElementById('patientDetails').textContent = result.message;
    } else {
      document.getElementById('patientDetails').textContent = 
        `Name: ${result.name}, Age: ${result.age}, Disease: ${result.disease}`;
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('patientDetails').textContent = 'Failed to fetch record';
  }
}
