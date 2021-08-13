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
const resourcesTable = document.getElementById('resourcesTable');
let resourcesBody = document.getElementById('resourcesBody');
const refreshResources = document.getElementById('refreshResources');

// main function for getting resources. Clears the resourcesTable tbody and 
// fills in line items from a getResources call
const getResources = () => {
  resourcesBody.remove();
  resourcesBody = document.createElement('tbody');
  resourcesBody.id = "resourcesBody";
  resourcesTable.append(resourcesBody);
  chrome.devtools.inspectedWindow.getResources((resources) => {
    resources.forEach(resource => {
      const resourceItem = document.createElement('tr');
      const resourceType = document.createElement('td');
      const resourceURL = document.createElement('td');
      resourceItem.className = "resourceRow";
      resourceType.className = "resourceType";
      resourceType.innerText = JSON.stringify(resource.type).slice(1,-1);
      resourceURL.className = "resourceURL";
      resourceURL.innerText = JSON.stringify(resource.url).slice(1,-1);
      resourceItem.append(resourceType, resourceURL);
      resourcesBody.append(resourceItem);
    });
  });
};

// initial resource list grab
getResources();

// Refresh button functionality
refreshResources.addEventListener('click', getResources);