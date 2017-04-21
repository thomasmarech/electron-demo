const database = require('./js/database');
const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

window.onload = function() {

  // Populate the table
  populateTable();

  // Add the add button click event
  document.getElementById('add').addEventListener('click', () => {

    // Retrieve the input fields
    var firstname = document.getElementById('firstname');
    var lastname = document.getElementById('lastname');

    // Save the person in the database
    database.addPerson(firstname.value, lastname.value);

    // Reset the input fields
    firstname.value = '';
    lastname.value = '';

    // Repopulate the table
    populateTable();
  });

  // Directory list
  populateDirectories();

  var list = document.getElementsByClassName('dir');
  for(i=0; i<list.length; i++) {
    list[i].addEventListener('click', (e) => {
      var dir = e.target.innerHTML;
      var command = 'start "" "' + dir + '"';
      console.log(command);

      child_process.exec(command);
    });
  }
}

// Populates the persons table
function populateTable() {

  // Retrieve the persons
  database.getPersons(function(persons) {

    // Generate the table body
    var tableBody = '';
    for (i = 0; i < persons.length; i++) {
      tableBody += '<tr>';
      tableBody += '  <td>' + persons[i].firstname + '</td>';
      tableBody += '  <td>' + persons[i].lastname + '</td>';
      tableBody += '  <td><input type="button" value="Delete" onclick="deletePerson(\'' + persons[i]._id + '\')"></td>'
      tableBody += '</tr>';
    }

    // Fill the table content
    document.getElementById('tablebody').innerHTML = tableBody;
  });
}

// Deletes a person
function deletePerson(id) {

  // Delete the person from the database
  database.deletePerson(id);

  // Repopulate the table
  populateTable();
}

function populateDirectories() {
  var dirs = getDirectories(os.homedir());
  var ulBody = '';
  for(i = 0; i < dirs.length; i++) {
    ulBody += '<li class="dir">' + dirs[i] + '</li>';
  }
  document.getElementById('uldirs').innerHTML = ulBody;
}

function getDirectories(srcpath) {
  var dirs = []; 
  fs.readdirSync(srcpath).map((value, index) => {
      var fullPath = path.join(srcpath, value);
      if(fs.statSync(fullPath).isDirectory())
        dirs.push(fullPath);
    });
  return dirs;
}