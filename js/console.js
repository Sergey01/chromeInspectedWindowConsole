// implement pretty print functionality
const pp = (stuff) => JSON.stringify(stuff, null, 2);

// grab and display tabId
document.getElementById('infoTabId').innerText = `TabID: ${chrome.devtools.inspectedWindow.tabId}`;

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
  // clear existing table body
  resourcesBody.remove();
  resourcesBody = document.createElement('tbody');
  resourcesBody.id = 'resourcesBody';
  resourcesTable.append(resourcesBody);

  // fetch inspectedWindow resources
  chrome.devtools.inspectedWindow.getResources((resources) => {
    resources.forEach(resource => {
      // parsing each resource into a table row
      const resourceItem = document.createElement('tr');
      const resourceType = document.createElement('td');
      const resourceURL = document.createElement('td');
      resourceItem.className = 'resourceRow';
      resourceType.className = 'resourceType';
      resourceType.innerText = resource.type;
      resourceURL.className = 'resourceURL';
      resourceURL.innerText = resource.url;

      // appending resource type and url to the row
      resourceItem.append(resourceType, resourceURL);

      // appending the row to the table body
      resourcesBody.append(resourceItem);
    });
  });
};

// initial resource table render
getResources();

// Refresh button functionality
refreshResources.addEventListener('click', getResources);

// debugger API test
const debuggerDiv = document.createElement('div');
debuggerDiv.id = 'debuggerDiv';
document.querySelector('body').append(debuggerDiv);
chrome.debugger.getTargets((targets) => debuggerDiv.innerText = pp(targets));