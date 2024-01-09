/**
 * Maps to validate tag prefixes in inputs against values of selects
 * No need for resource as it's always 'RS'
 * No need for company since user cannot edit the value out of dropdown
 */
const driverPrefixMap = new Map([
	['CC', 'CC'],
	['PG', 'PG'],
	['GR', 'GR'],
	['GR', 'GR'],
	['GF', 'GF'],
	['PJ', 'PJ'],
	['AC', 'AC']
]);

const optionalPrefixMap = new Map([
	['AC', 'AC'],
	['AS', 'AS'],
	['GR', 'GR'],
	['IN', 'IN'],
	['PY', 'PY'],
	['PG', 'PG'],
	['WO', 'WO']
]);

//The values of these may change but the elements themselves will not
const companySelect = document.getElementById('companySelect');
const driverSelect = document.getElementById('driverSelect');
const resourceSelect = document.getElementById('resourceSelect');
const optionalSelect = document.getElementById('optionalSelect');

const driverInput = document.getElementById('driverInput');
const resourceInput = document.getElementById('resourceInput');
const optionalInput = document.getElementById('optionalInput');

const worktagButtonGroup = document.getElementById('companyButtonGroup');
const driverButtonGroup = document.getElementById('driverButtonGroup');
const optionalButtonGroup = document.getElementById('optionalButtonGroup');

/**
 * A set of helper functions to manage the various inputs and buttons 
 * Used to initialize/reset fields or enable/disable selects/inputs/buttons
 * Pass in the element's HTML ID as a string
 */
function enable(element){
	document.getElementById(element).disabled = false;
}

function disable(element){
	document.getElementById(element).disabled = true;
}

function show(element){
	document.getElementById(element).hidden = false;
}

function hide(element){
	document.getElementById(element).hidden = true;
}

function clearSelect(element){
	document.getElementById(element).selectedIndex = 0;
}

function clearInput(element){
	document.getElementById(element).value = '';
}

function focusItem(element){
	document.getElementById(element).focus();
}

//Clears entire form & re-initializes in default state.
function resetForm(){
	enableAllOptionals();

	clearInput('driverInput');
	clearInput('resourceInput');
	clearInput('optionalInput');
	clearInput('FieldValue');

	clearSelect('companySelect');
	clearSelect('driverSelect');
	clearSelect('optionalSelect');
	
	disable('addOptionalBtn');
	disable('addResourceBtn');
	disable('addDriverBtn');
	disable('driverSelect');
	disable('driverInput');
	disable('addResourceBtn');
	disable('optionalSelect');
	disable('optionalInput');
	disable('resourceSelect');
	disable('resourceInput');
	disable('submitBtn');

	hide('resourceSelect');
	hide('resourceInput');
	hide('addResourceBtn');

	show('addDriverBtn');
	
	enable('companySelect');
	focusItem('companySelect');
}


// This returns true if a driver tag needs a resource, else returns false
// UW1861 + CC && SOM + CC Require RS
function requiresResource(company, driver){
	if ((company == 'UW1861' || company == 'SOM') && driver == 'CC'){
		return true;
	}
	else{
		return false;
	}
}


// Sets the first two characters of a tag's input to the correct prefix - EG 'Cost Center' -> 'CC'
function addDriverPrefix(){
	driverInput.value = driverSelect.value;
}

function addResourcePrefix(){
	resourceInput.value = 'RS';
}

function addOptionalPrefix(){
	optionalInput.value = optionalSelect.value;
}


/**
 * We're adding tags to a button group. first element of this group is always company. 
 * If company doesn't exist, create the element and add it to the group.
 * If company already exists, just update the text content 
 */
function addCompanyTag(){
	let worktagButtons = Array.from(worktagButtonGroup.getElementsByTagName('button'));
	let selectedCompany = companySelect.value;
	let companyButton = worktagButtons[0];

	if(selectedCompany === '---'){
		return;
	}

	if(selectedCompany === 'SOM'){
		somActivityAdd();
	}

	if (!companyButton){ //If there is no company button create a new one and set properties
		let newCompanyButton = document.createElement('button');
		newCompanyButton.type = 'button';
		newCompanyButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newCompanyButton.textContent = selectedCompany;
		newCompanyButton.id = 'companyButton';
		newCompanyButton.onclick =  function() { removeWorktagElement(this, "company"); };
		worktagButtonGroup.appendChild(newCompanyButton);
	}
	else{ //If there is update the text. Probably never going to execute, basically just a fall-back.
		companyButton.textContent = selectedCompany;
	}

	//Adds company to current worktag string, shows button for current company, moves on to driver input
	disable('companySelect');
	enable('driverSelect');
	focusItem('driverSelect');
	show('companyRow');
	stringifyWorktag();
}


//SOM can use 'AC' as a driver tag. Only SOM can do this. Creates an option for an AC Driver and adds it to the driver select when SOM is company
function somActivityAdd(){
	let acDriver = document.createElement('option');
	acDriver.value = 'AC';
	acDriver.text = 'Activity';
	driverSelect.add(acDriver);
}

//If the company was SOM and is changed, remove AC as a driver option
/*
function somActivityRemove(){
	for (let i = 0; i < driverSelect.options.length; i++) {
	  	if (driverSelect.options[i].value === 'AC') {
			driverSelect.remove(i);
	  	}
	}
}*/

function somActivityRemove() {
    let optionToRemove = document.querySelector("select#driverSelect option[value='AC']");
    if (optionToRemove) {
        optionToRemove.remove();
    }
}


/**
 * Enables driver input when a driver type is selected. Disables if select changes back to default '---'
 * Checks to see if the company/driver combo needs a resource tag. If it does, enable and show the resource fields
 */
function driverTagSelect(){	
	let currentCompany = companySelect.value;
	let selectedDriver = driverSelect.value;
	let needsResource = requiresResource(currentCompany, selectedDriver); //passing in string values for company and driver
	
	if(selectedDriver === '---'){
		disable('driverInput');
	}
	else if(needsResource){
		enable('driverInput');
		addDriverPrefix();

		show('resourceSelect');
		enable('resourceSelect');
		show('resourceInput');
		enable('resourceInput');
		addResourcePrefix();
		show('addResourceBtn');
		
		//Hides and disables normal driver btn because we need resource tag
		disable('addDriverBtn');
		hide('addDriverBtn');

		focusItem('driverInput');
	}
	else{
		enable('driverInput');
		show('addDriverBtn');
		addDriverPrefix();

		//hides resource stuff in case it was already up when the select was changed
		disable('resourceSelect');
		hide('resourceSelect');
		disable('resourceInput');
		hide('resourceInput');
		disable('addResourceBtn');
		hide('addResourceBtn');

		focusItem('driverInput');
	}
}

/**
 * Enables the 'Add' button only when a Driver tag is 8 characters and has correct prefix
 * If a resource is needed this invokes the resource tag input instead to check both driver AND resource before turning button on.
 * Invoked from the driver tag input field on key up 
 */
function driverTagInput(){
	let currentCompany = companySelect.value;
	let selectedDriver = driverSelect.value;
	let currentDriver = driverInput.value;
	let needsResource = requiresResource(currentCompany, selectedDriver);
	
	if(needsResource){
		resourceTagInput(); //resource input function handles both driver & resource, invoking it here to make sure changes to driver input affect resource add btn
		return;
	}

	if(!validateTag(currentDriver, 'driver')){ //Disables 'add' button while tag doesn't meet requirements
		disable('addDriverBtn');
	}
	else{
		enable('addDriverBtn');
		focusItem('addDriverBtn');
	}
}

function resourceTagInput(){
	let currentDriver = driverInput.value;
	let currentResource = resourceInput.value;

	if(validateTag(currentDriver, 'driver')){
		focusItem('resourceInput');
	}
	if(validateTag(currentDriver, 'driver') && validateTag(currentResource, 'resource')){
		enable('addResourceBtn');
		focusItem('addResourceBtn');
	}
	else{
		disable('addResourceBtn');
	}
}

/**
 * Adds Driver Tag Button to Button Group
 * Disables Driver Input. enables optional
 */
function addDriverTag(){
	show('driverRow');

	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let selectedDriver = document.getElementById('driverInput').value;
	let driverButton = driverButtons[1];
	
	if(!driverButton){ //If there is no driver button create a new element and set properties
		let newDriverButton = document.createElement('button');
		newDriverButton.type = 'button';
		newDriverButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newDriverButton.textContent = selectedDriver;
		newDriverButton.id = 'driverButton';
		newDriverButton.onclick =  function() { removeWorktagElement(this, "driver"); };
		driverButtonGroup.appendChild(newDriverButton);
	}
	else{ //If there is a driver button just update the text in it
		driverButton.textContent = selectedDriver;
	}
	disable('driverSelect');
	disable('driverInput');
	disable('addDriverBtn');

	enable('optionalSelect');
	enable('submitBtn');
	stringifyWorktag();
	noDuplicateTags();
	focusItem('optionalSelect');
}

// Same as the addDriverTag function, just handles the additional resource tag when that's needed.
function addResourceTag(){
	show('driverRow');

	let driverButtons = Array.from(worktagButtonGroup.getElementsByTagName('button'));
	let selectedDriver = driverInput.value;
	let selectedResource = resourceInput.value;
	let driverButton = driverButtons[1];
	let resourceButton = driverButtons[2];

	if(!driverButton){ //If there is no driver button create a new element and set properties
		let newDriverButton = document.createElement('button');
		newDriverButton.type = 'button';
		newDriverButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newDriverButton.textContent = selectedDriver;
		newDriverButton.id = 'driverButton';
		newDriverButton.onclick =  function() { removeWorktagElement(this, "driver"); };
		driverButtonGroup.appendChild(newDriverButton);
	}
	else{
		driverButton.textContent = selectedDriver; //If there is a driver button just update the text in it and set
	}
	if(!resourceButton){ //If there is no resource button create a new element and set properties
		let newResourceButton = document.createElement('button');
		newResourceButton.type = 'button';
		newResourceButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newResourceButton.textContent = selectedResource;
		newResourceButton.id = 'resourceButton';
		newResourceButton.onclick = function() { removeWorktagElement(this, "resource"); };
		driverButtonGroup.appendChild(newResourceButton);
	}
	else{ //If there is a resource button just update the text in it
		resourceButton.textContent = selectedResource; 
	}
	disable('driverSelect');
	disable('driverInput');
	disable('resourceSelect');
	disable('resourceInput');
	disable('addResourceBtn');

	enable('optionalSelect');
	enable('submitBtn');

	stringifyWorktag();
	noDuplicateTags();
	focusItem('optionalSelect');
}

//watches optional tag select menu, enables input when selected, pre-populates input w/ correct prefix
function optionalTagSelect(){
	let currentOptional = optionalSelect.value;
	document.getElementById('addOptionalBtn').disabled = true;
	if(currentOptional != '---'){
		enable('optionalInput');
		addOptionalPrefix();
		focusItem('optionalInput');
	}
}

//Watches optional tag input and enables button only while a valid optional tag string exists in the input
function optionalTagInput(){
	let selectedOptional = optionalInput.value;

	if(!validateTag(selectedOptional, "optional")){
		disable('addOptionalBtn');
	}
	else{
		enable('addOptionalBtn');
		focusItem('addOptionalBtn');
	}
}

//Program, Activity, and Grant Stand Alone could all potentially be drivers
//If one of these is a driver we want to disallow the use of that one as an optional tag when enabling optional select
function noDuplicateTags(){
	let currentDriver = driverSelect.value;
	if (currentDriver == 'PG' || currentDriver == 'GR' || currentDriver == 'AC'){
		for(let j = 0; j < optionalSelect.options.length; j++){
			if(optionalSelect.options[j].value == currentDriver){
				optionalSelect.options[j].disabled = true;
			}
		}
	}
}

function enableAllOptionals(){
	for(let j = 0; j < optionalSelect.options.length; j++){
		optionalSelect.options[j].disabled = false;
	}
}

/**
 * Adding optional button to group
 * re-creating final return string based on current complete string
 * i only used in 'addOptionalTag()' but declared outside the function so it doesn't reset each time function is invoked. 
 * i doesn't actually matter in current version but is there for unique element ids anyway
 */
let i = 1;

function addOptionalTag(){
	let addedOptional = optionalInput.value;
	
	if(validateTag(addedOptional, "optional")){
		show('optionalRow');
		let worktagButtonGroup = document.getElementById('optionalButtonGroup');

		let newOptionalButton = document.createElement('button');
		//properties for the new button
		newOptionalButton.type = 'button';
		newOptionalButton.classList.add('btn', 'btn-outline-dark', 'c2-btn');
		newOptionalButton.textContent = addedOptional;
		newOptionalButton.id = 'optionalButton' + i;
		newOptionalButton.onclick = function() { removeWorktagElement(this, "optional"); };
		//add new button to group
		worktagButtonGroup.appendChild(newOptionalButton);
		//Disable the Optional Type that was just added
		disableAddedTag(addedOptional);

		i++;

		//Reset Optional Select/Input to be ready for next opt tag
		clearSelect('optionalSelect');
		clearInput('optionalInput');
		disable('optionalInput');
		disable('addOptionalBtn');
		focusItem('optionalSelect');

		//Update final worktag string
		stringifyWorktag();
	}
	else{
		invalidTag("optional");
	}	
}

function disableAddedTag(tag){
	for(let j = 0; j < optionalSelect.options.length; j++){
		if(optionalSelect.options[j].value == tag.substring(0, 2)){
			optionalSelect.options[j].disabled = true;
		}
	}
}

function enableRemovedTag(tag){
	for(let j = 0; j < optionalSelect.options.length; j++){
		if(optionalSelect.options[j].value == tag.substring(0, 2)){
			optionalSelect.options[j].disabled = false;
		}
	}
}

/**
 * Removes selected worktag from constructed buttons and strings
 * clearing company resets everything 
 */
function removeWorktagElement(button, type){
	let companyButton = document.getElementById('companyButton');
	let driverButtonGroup = document.getElementById('driverButtonGroup');
	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let optionalButtonGroup = document.getElementById('optionalButtonGroup');
	let optionalButtons = Array.from(optionalButtonGroup.getElementsByTagName('button'));
	
	if(type == 'company'){
		optionalButtons.forEach( button => {
			button.remove();
		});
		driverButtons.forEach( button => {
			button.remove();
		});
		if(companyButton.textContent == 'SOM'){
			somActivityRemove();
		}
		
		companyButton.remove();
		resetForm();
		hide('companyRow');
		hide('driverRow');
		hide('optionalRow');
	}
	else if(type == 'driver' || type == 'resource'){
		optionalButtons.forEach( button => {
			button.remove();
		});
		driverButtons.forEach( button => {
			button.remove();
		});
		clearSelect('driverSelect');
		clearInput('driverInput');
		clearInput('resourceInput');
		disable('resourceInput');
		disable('resourceSelect');
		disable('addResourceBtn');
		disable('optionalSelect');
		disable('addOptionalBtn');
		disable('submitBtn');
		hide('resourceInput');
		hide('resourceSelect');
		hide('addResourceBtn');
		hide('driverRow');		
		hide('optionalRow');
		enable('driverSelect');
		show('addDriverBtn');
		focusItem('driverSelect');
		enableAllOptionals();
		stringifyWorktag();
	}
	else if(type == 'optional'){
		let tag = button.textContent;
		optionalButtonGroup.removeChild(button);
		stringifyWorktag();
		enableRemovedTag(tag);
		if(optionalButtonGroup.childElementCount == 0){
			hide('optionalRow');
		}
	}
}

/**
 * Validates all tags. 
 * Split tag into prefix and numbers. Uses maps defined at start to verify prefixes match the selected driver. regex to confirm following 6 characters are all 0-9 digits.
 */
function validateTag(tag, tagType){ //Where tag is the actual value of whichever tag, and tagType is the tag's identifier
	if (tag.length < 8) { return false; }
	let chars = tag.slice(0, 2);
	let nums = tag.slice(2);
	let charsAreValid = false;

	if(tagType == 'driver'){
		let driver = driverSelect.value;
		let expectedValue = driverPrefixMap.get(driver);
		charsAreValid = expectedValue === chars; //is true when the chars match the paired key in driver value/prefix map
	}
	else if(tagType == 'resource' && chars == 'RS'){
		charsAreValid = true; //because resource can only be RS
	}
	else if(tagType == 'optional'){
		let optional = optionalSelect.value;
		let expectedValue = optionalPrefixMap.get(optional);
		charsAreValid = expectedValue === chars; //is true when the chars match the paired key in optional value/prefix map
	}

	//checks the number part of the tag is six numerical digits
	let numsAreValid = /^\d{6}$/.test(nums);

	if (charsAreValid && numsAreValid){
		return true; //returns true when both parts of tag string match expected format
	}
	else{
		return false; //or false if either check fails
	}
}

/**
 * Construct a string for final return to pace
 * also verifies final string to enable submit button, since this is only invoked when submitting is feasible to do
 */
function stringifyWorktag(){
	let company = companySelect.value;
	let worktagString = ''; //We are not concatenating, but over-writing the whole thing since it can change, 
	let driverButtons = Array.from(driverButtonGroup.getElementsByTagName('button'));
	let optionalButtons = Array.from(optionalButtonGroup.getElementsByTagName('button'));
		
	worktagString += company + ';';
	driverButtons.forEach( button =>
		{ worktagString += button.textContent + ';'; } 
	);
	optionalButtons.forEach( button =>
		{ worktagString += button.textContent + ';' }
	);

	console.log(`Stringified Worktag: ${worktagString}`);
	document.getElementById('FieldValue').value = worktagString;
	return worktagString;
}


/**
 * Submits the final worktags. Validation is done prior to enabling submit button. Making a valid string invalid disables submit button so there no need to check again.
 */
function submitWorktags(){
	// -- Debug Lines -- //
	let submitted = stringifyWorktag();
	navigator.clipboard.writeText(submitted);
	copyConfirm(submitted);
	
}	

function copyConfirm(tagString){ 
	let errorMsgElement = document.getElementById('error_msg');
	errorMsgElement.classList.remove('fade-out');
	errorMsgElement.innerHTML = `<p class="error-msg"><b>Worktag String ${tagString} Copied to Clipboard.</b></p>`;
	setTimeout(() => {
		errorMsgElement.classList.add('fade-out');
	}, 2000);
	setTimeout(() => {
		errorMsgElement.innerHTML = '';
	}, 3000);
}	
	

/**
 * DEPRECATED FUNCTIONS
 * Anything below this is not used in current implementation unless something goes very wrong
 */
	
//throws an error message in edge cases where user tries to add invalid tag
//should be impossible to invoke but leaving it as a fallback
function invalidTag(type){ 
	let errorMsgElement = document.getElementById('error_msg');
	errorMsgElement.classList.remove('fade-out');
	errorMsgElement.innerHTML = `<p class="error-msg"><b>Invalid ${type} tag. Include both 2-character prefix and 6-digit numerical code.</b></p>`;
	setTimeout(() => {
		errorMsgElement.classList.add('fade-out');
	}, 2000);
	setTimeout(() => {
		errorMsgElement.innerHTML = '';
	}, 3000);
}
	
	