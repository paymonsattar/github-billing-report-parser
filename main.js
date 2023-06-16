const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Create an empty list of actions
let actions = [];

// Read in the CSV file
fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Check if the 'Action Workflow' value is not null and is not already in the actions list
    if (row['Actions Workflow'] !== null && !actions.some(action => action.name === row['Actions Workflow'])) {
      // Create a new action with a quantity of 0 and add it to the actions list
      actions.push({ name: row['Actions Workflow'], quantity: 0 });
    }
    
    // Find the action in the actions list and add the quantity from the CSV row
    const action = actions.find(action => action.name === row['Actions Workflow']);
    if (action) {
      action.quantity += parseInt(row['Quantity']);
    }
  })
  .on('end', () => {
    // Sort the actions list by quantity in descending order
    actions.sort((a, b) => b.quantity - a.quantity);

    let total = 0
    for(const action of actions) {
      if (action.name.includes('test')) {
      total = total + action.quantity
      }
    }
    
    // Create a CSV writer object and write the sorted actions list to a CSV file
    const csvWriter = createCsvWriter({
      path: 'output.csv',
      header: [
        { id: 'name', title: 'Action Workflow' },
        { id: 'quantity', title: 'Quantity' }
      ]
    });
    csvWriter.writeRecords(actions)
      .then(() => console.log('CSV file written successfully'));
  });
