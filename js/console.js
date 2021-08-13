const pp = (stuff) => JSON.stringify(stuff, null, 2); // pretty print

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
})