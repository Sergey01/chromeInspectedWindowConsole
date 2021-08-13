// implement pretty print functionality
const pp = (stuff) => JSON.stringify(stuff, null, 2);

// "console" functionality
const input = document.getElementById('commandInput');
const submit = document.getElementById('inputSubmit');
const output = document.getElementById('outputContainer');

submit.addEventListener('click', async (e) => {
  const command = input.value;
  chrome.devtools.inspectedWindow.eval(command, (result, isException) => {
    if (isException) {
      output.innerText = `ERROR: ${isException.value}`;
    } else {
      output.innerText = pp(result);
    }
  })
});

// getResources functionality
const resourcesDiv = document.getElementById('resources');
const refreshResources = document.getElementById('refreshResources');

// initial resource list grab
chrome.devtools.inspectedWindow.getResources((resources) => {
  resourcesDiv.innerText = pp(resources);
});

// Refresh button functionality
refreshResources.addEventListener('click', async (e) => {
  chrome.devtools.inspectedWindow.getResources((resources) => {
    resourcesDiv.innerText = pp(resources);
  })
});