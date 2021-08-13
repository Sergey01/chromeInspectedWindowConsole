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
const resourcesList = document.getElementById('resources');
const refreshResources = document.getElementById('refreshResources');

// main function for getting resources. Clears the resourcesList and 
// fills in line items from a getResources call
const getResources = () => {
  chrome.devtools.inspectedWindow.getResources((resources) => {
    resources.forEach(resource => {
      const resourceItem = document.createElement('li');
      resourceItem.className = "resource";
      resourceItem.innerText = pp(resource);
      resourcesList.append(resourceItem);
    })
  })
};

// initial resource list grab
getResources();

// Refresh button functionality
refreshResources.addEventListener('click', getResources);