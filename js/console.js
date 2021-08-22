// test comment

// implement pretty print functionality
const pp = (stuff) => JSON.stringify(stuff, null, 2);

// grab and display tabId
const tabId = chrome.devtools.inspectedWindow.tabId;
document.getElementById('infoTabId').innerText = `TabID: ${tabId}`;

// "console" functionality
const input = document.getElementById('commandInput');
const submit = document.getElementById('inputSubmit');
const output = document.getElementById('outputContainer');

submit.addEventListener('click', async (e) => {
  const command = input.value;
  const consoleType = document.querySelector('input[name="consoleType"]:checked');
  
  if (consoleType.value == 'inspectedWindow') {
    chrome.devtools.inspectedWindow.eval(command, (result, isException) => {
      if (isException) {
        output.innerText = `ERROR: ${isException.value}`;
      } else {
        output.innerText = pp(result);
      }
    })
  };

  if (consoleType.value == 'debugger') {
    // output.innerText = `${command} will be sent to the debugger once this code is finished`;
    let [method, commandParams] = command.split(' ');
    if (commandParams) commandParams = JSON.parse(commandParams);
    chrome.debugger.sendCommand({tabId: tabId}, method, commandParams, (result) => {
      if (chrome.runtime.lastError) { 
        output.innerText = `${chrome.runtime.lastError.message}`
      }  
      if (result) {
          output.innerText = pp(result)
      }
       
    })
  }
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
      
      // setting styling class names
      resourceItem.className = 'resourceRow';
      resourceType.className = 'resourceType';
      resourceURL.className = 'resourceURL';

      // populating type and url cells
      resourceType.innerText = resource.type;
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
const debuggerDiv2 = document.createElement('div');
debuggerDiv2.id = 'debuggerDiv2';
document.getElementById('debuggerStuff').append(debuggerDiv, debuggerDiv2);
chrome.debugger.getTargets((targets) => debuggerDiv.innerText = pp(targets));
chrome.debugger.attach({tabId: tabId}, '1.3', ()=> debuggerDiv2.innerText = `ATTACHED TO tabId: ${tabId}`);
chrome.debugger.onDetach.addListener((source, reason) => {
  const detachString = `${pp(source)} has disconnected from the debugger session for the following reason: ${reason}`;
  console.log(detachString);
  alert(detachString);
});